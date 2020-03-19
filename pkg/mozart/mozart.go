package mozart

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"
)

const (
	SUCCEEDED       = "SUCCEEDED"
	FAILED          = "FAILED"
	FAILED_CONTINUE = "FAILED_CONTINUE"
	SKIPPED         = "SKIPPED"
	TERMINAL        = "TERMINAL"
	UNDEPLOYED      = "UNDEPLOYED"
	UNDEPLOY_FAILED = "UNDEPLOY_FAILED"
)

type Mozart struct {
	deployer         deployer.UseCases
	executionMain    execution.UseCases
	currentExecution *execution.Execution
	done             chan bool
	errc             chan error
	quit             chan bool
}

type UseCases interface {
	Start(pipeline *pipeline.Pipeline) (*execution.Execution, error)
}

func NewMozart(deployer deployer.UseCases, executionMain execution.UseCases) *Mozart {
	return &Mozart{deployer, executionMain, nil, make(chan bool), make(chan error), make(chan bool)}
}

func (mozart *Mozart) Start(pipeline *pipeline.Pipeline) (*execution.Execution, error) {
	newExecution, err := mozart.createExecutionLog(pipeline)
	if err != nil {
		return nil, err
	}

	go func() {
		mozart.deployComponentsToCluster(pipeline)

		mozart.undeployComponentsFromCluster(pipeline)
		mozart.deployIstioComponentsToCluster(pipeline, context.Background())
		mozart.finishExecutionLog()
		mozart.done <- true
	}()

	go func() {
		for {
			select {
			case <-mozart.errc:
				log.Println("ERROR")
				mozart.triggerWebhook(pipeline.Webhook, FAILED)
				return
			case <-mozart.done:
				log.Println("FINISHED")
				mozart.triggerWebhook(pipeline.Webhook, SUCCEEDED)
				return
			}
		}
	}()

	return newExecution, nil
}

func (mozart *Mozart) triggerWebhook(webhook string, status string) error {
	data, err := json.Marshal(map[string]string{
		"status": status,
	})
	if err != nil {
		return err
	}

	_, err = http.Post(webhook, "application/json", bytes.NewBuffer(data))
	if err != nil {
		utils.CustomLog("error", "triggerWebhook", err.Error())
		return err
	}

	return nil
}

func (mozart *Mozart) deployComponentsToCluster(pipeline *pipeline.Pipeline) {
	for _, component := range pipeline.Versions {
		deployedComponent := mozart.createDeployedComponentLog(component)
		err := mozart.deployComponentManifestsToCluster(pipeline, deployedComponent, component, context.Background())
		if err != nil {
			mozart.errc <- err
			break
		}
	}
}

func (mozart *Mozart) deployComponentManifestsToCluster(
	pipeline *pipeline.Pipeline, deployedComponent *execution.DeployedComponent, component *pipeline.Version, ctx context.Context,
) error {

	manifests, err := mozart.deployer.GetManifestsByHelmChart(pipeline, component)
	if err != nil {
		utils.CustomLog("error", "deployComponentManifestsToCluster", err.Error())
		return err
	}

	errs, ctx := errgroup.WithContext(ctx)
	for manifestKey, manifest := range manifests {
		deployedManifest := mozart.createDeployedManifestLog(deployedComponent.ID, manifestKey, manifest)
		updateDeployedManifest := mozart.updateDeployedManifestLog(deployedManifest.ID, deployedComponent.ID)
		func(manifest interface{}) {
			errs.Go(func() error {
				updateDeployedManifest(execution.ManifestDeploying)
				err := mozart.deployer.Deploy(manifest.(map[string]interface{}), false)
				if err != nil {
					updateDeployedManifest(execution.ManifestFailed)
					return err
				}

				updateDeployedManifest(execution.ManifestDeployed)
				return nil
			})
		}(manifest)

	}

	return errs.Wait()
}

func (mozart *Mozart) undeployComponentsFromCluster(pipeline *pipeline.Pipeline) {
	for _, component := range pipeline.UnusedVersions {
		undeployedComponent := mozart.createUndeployedComponentLog(component)
		err := mozart.undeployComponentManifestsFromCluster(pipeline, undeployedComponent, component, context.Background())
		if err != nil {
			mozart.errc <- err
			break
		}
	}
}

func (mozart *Mozart) undeployComponentManifestsFromCluster(
	pipeline *pipeline.Pipeline, undeployedComponent *execution.UndeployedComponent, component *pipeline.Version, ctx context.Context,
) error {
	manifests, err := mozart.deployer.GetManifestsByHelmChart(pipeline, component)
	if err != nil {
		utils.CustomLog("error", "deployComponentManifestsToCluster", err.Error())
		return err
	}

	errs, ctx := errgroup.WithContext(ctx)
	for manifestKey, manifest := range manifests {
		undeployedManifest := mozart.createUndeployedManifestLog(undeployedComponent.ID, manifestKey, manifest)
		updateUndeployedManifest := mozart.updateUndeployedManifestLog(undeployedManifest.ID, undeployedComponent.ID)
		func(manifest interface{}) {
			errs.Go(func() error {
				updateUndeployedManifest(execution.ManifestUndeploying)
				err := mozart.deployer.Undeploy(manifest.(map[string]interface{}))
				if err != nil {
					updateUndeployedManifest(execution.ManifestFailed)
					log.Fatalln(err)
					return err
				}

				updateUndeployedManifest(execution.ManifestUndeployed)
				return nil
			})
		}(manifest)
	}

	return errs.Wait()
}

func (mozart *Mozart) deployIstioComponentsToCluster(pipeline *pipeline.Pipeline, ctx context.Context) {
	errs, ctx := errgroup.WithContext(ctx)
	for istioManifestKey, istioManifest := range pipeline.Istio {
		executioIstioComponent := mozart.createExecutionIstioComponentLog(mozart.currentExecution.ID, istioManifestKey, istioManifest)
		updateExecutionIstioComponent := mozart.updateExecutionIstionComponentLog(executioIstioComponent.ID)
		func(manifest interface{}) {
			errs.Go(func() error {
				updateExecutionIstioComponent(execution.ManifestDeploying)
				err := mozart.deployer.Deploy(istioManifest.(map[string]interface{}), true)
				if err != nil {
					updateExecutionIstioComponent(execution.ManifestFailed)
					log.Fatalln(err)
					return err
				}

				updateExecutionIstioComponent(execution.ManifestDeployed)
				return nil
			})
		}(istioManifest)
	}

	if errs.Wait() != nil {
		mozart.errc <- errs.Wait()
	}
}

func (mozart *Mozart) createExecutionLog(pipeline *pipeline.Pipeline) (*execution.Execution, error) {
	newExecution := &execution.Execution{
		Name:      pipeline.Name,
		Namespace: pipeline.Namespace,
		Author:    pipeline.GithubAccount.Username,
		StartTime: time.Now(),
		Webhook:   pipeline.Webhook,
		HelmURL:   pipeline.HelmRepository,
	}

	currentExecution, err := mozart.executionMain.Create(newExecution)
	mozart.currentExecution = currentExecution
	return currentExecution, err
}

func (mozart *Mozart) updateExecutionLog(status string) {
	id := mozart.currentExecution.ID.String()
	mozart.executionMain.UpdateStatus(id, status)
}

func (mozart *Mozart) finishExecutionLog() {
	id := mozart.currentExecution.ID.String()
	mozart.executionMain.FinishExecution(id)
}

func (mozart *Mozart) createDeployedComponentLog(component *pipeline.Version) *execution.DeployedComponent {
	newComponent := &execution.DeployedComponent{
		ExecutionID: mozart.currentExecution.ID,
		Name:        component.Version,
		ImageURL:    component.VersionURL,
	}
	deployedComponent, _ := mozart.executionMain.CreateDeployedComponent(newComponent)

	return deployedComponent
}

func (mozart *Mozart) createUndeployedComponentLog(component *pipeline.Version) *execution.UndeployedComponent {
	newComponent := &execution.UndeployedComponent{
		ExecutionID: mozart.currentExecution.ID,
		Name:        component.Version,
		ImageURL:    component.VersionURL,
	}
	undeployedComponent, _ := mozart.executionMain.CreateUndeployedComponent(newComponent)

	return undeployedComponent
}

func (mozart *Mozart) createExecutionIstioComponentLog(executionID uuid.UUID, manifestKey string, manifest interface{}) *execution.IstioComponent {
	manifestBytes, _ := json.Marshal(&manifest)

	newManifest := &execution.IstioComponent{
		ExecutionID: mozart.currentExecution.ID,
		Name:        manifestKey,
		Manifest:    string(manifestBytes),
	}

	executionIstioComponent, _ := mozart.executionMain.CreateIstioComponent(newManifest)
	return executionIstioComponent
}

func (mozart *Mozart) createDeployedManifestLog(executionComponentID uuid.UUID, manifestKey string, manifest interface{}) *execution.DeployedComponentManifest {
	manifestBytes, _ := json.Marshal(&manifest)

	newManifest := &execution.DeployedComponentManifest{
		DeployedComponentID: executionComponentID,
		Name:                manifestKey,
		Manifest:            string(manifestBytes),
	}

	executionManifest, _ := mozart.executionMain.CreateDeployedManifest(newManifest)
	return executionManifest
}

func (mozart *Mozart) createUndeployedManifestLog(executionComponentID uuid.UUID, manifestKey string, manifest interface{}) *execution.UndeployedComponentManifest {
	manifestBytes, _ := json.Marshal(&manifest)

	newManifest := &execution.UndeployedComponentManifest{
		UndeployedComponentID: executionComponentID,
		Name:                  manifestKey,
		Manifest:              string(manifestBytes),
	}

	executionManifest, _ := mozart.executionMain.CreateUndeployedManifest(newManifest)
	return executionManifest
}

func (mozart *Mozart) updateDeployedManifestLog(id uuid.UUID, executionComponentID uuid.UUID) func(string) {
	return func(status string) {
		mozart.executionMain.UpdateDeployedManifestStatus(id, executionComponentID, status)
	}
}

func (mozart *Mozart) updateUndeployedManifestLog(id uuid.UUID, executionComponentID uuid.UUID) func(string) {
	return func(status string) {
		mozart.executionMain.UpdateUndeployedManifestStatus(id, executionComponentID, status)
	}
}

func (mozart *Mozart) updateExecutionIstionComponentLog(id uuid.UUID) func(string) {
	return func(status string) {
		mozart.executionMain.UpdateIstioComponentStatus(id, mozart.currentExecution.ID, status)
	}
}
