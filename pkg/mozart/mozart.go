package mozart

import (
	"encoding/json"
	"net/http"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Mozart struct {
	deployer         deployer.UseCases
	executionMain    execution.UseCases
	currentExecution *execution.Execution
}

type UseCases interface {
	Start(pipeline *pipeline.Pipeline) (*execution.Execution, error)
}

func NewMozart(deployer deployer.UseCases, executionMain execution.UseCases) *Mozart {
	return &Mozart{deployer, executionMain, nil}
}

func (mozart *Mozart) Start(pipeline *pipeline.Pipeline) (*execution.Execution, error) {
	newExecution, err := mozart.createExecutionLog(pipeline)
	if err != nil {
		return nil, err
	}

	go func() {
		mozart.deployComponentsToCluster(pipeline)
		mozart.undeployComponentsFromCluster(pipeline)
		mozart.deployIstioComponentsToCluster(pipeline)
		mozart.finishExecutionLog()
	}()

	return newExecution, nil
}

func (mozart *Mozart) triggerWebhook(webhook string) func() {
	return func() {
		_, err := http.Get(webhook)
		if err != nil {
			utils.CustomLog("error", "triggerWebhook", err.Error())
			return
		}
	}
}

func (mozart *Mozart) deployComponentsToCluster(pipeline *pipeline.Pipeline) {
	for _, component := range pipeline.Versions {
		executionComponent := mozart.createDeployedComponentLog(component)
		mozart.deployComponentManifestsToCluster(pipeline, executionComponent, component)
	}
}

func (mozart *Mozart) deployComponentManifestsToCluster(
	pipeline *pipeline.Pipeline, executionComponent *execution.DeployedComponent, component *pipeline.Version,
) {
	var wg sync.WaitGroup
	manifests, err := mozart.deployer.GetManifestsByHelmChart(pipeline, component)
	if err != nil {
		utils.CustomLog("error", "deployComponentManifestsToCluster", err.Error())
		return
	}

	for manifestKey, manifest := range manifests {
		wg.Add(1)
		deployedManifest := mozart.createDeployedManifestLog(executionComponent.ID, manifestKey, manifest)
		updateDeployedManifest := mozart.updateDeployedManifestLog(deployedManifest.ID, executionComponent.ID)
		go mozart.deployer.Deploy(manifest.(map[string]interface{}), false, updateDeployedManifest, &wg)
	}

	wg.Wait()
}

func (mozart *Mozart) undeployComponentsFromCluster(pipeline *pipeline.Pipeline) {
	for _, component := range pipeline.UnusedVersions {
		mozart.undeployComponentManifestsFromCluster(pipeline, nil, component)
	}
}

func (mozart *Mozart) undeployComponentManifestsFromCluster(
	pipeline *pipeline.Pipeline, executionComponent *execution.DeployedComponent, component *pipeline.Version,
) {
	var wg sync.WaitGroup
	manifests, err := mozart.deployer.GetManifestsByHelmChart(pipeline, component)
	if err != nil {
		utils.CustomLog("error", "deployComponentManifestsToCluster", err.Error())
		return
	}

	for manifestKey, manifest := range manifests {
		wg.Add(1)
		undeployedManifest := mozart.createDeployedManifestLog(executionComponent.ID, manifestKey, manifest)
		updateUndeployedManifest := mozart.updateDeployedManifestLog(undeployedManifest.ID, executionComponent.ID)
		go mozart.deployer.Undeploy(manifest.(map[string]interface{}), updateUndeployedManifest, &wg)
	}

	wg.Wait()
}

func (mozart *Mozart) deployIstioComponentsToCluster(pipeline *pipeline.Pipeline) {
	var wg sync.WaitGroup

	for istioManifestKey, istioManifest := range pipeline.Istio {
		wg.Add(1)
		executioIstioComponent := mozart.createExecutionIstioComponentLog(mozart.currentExecution.ID, istioManifestKey, istioManifest)
		updateExecutionIstioComponent := mozart.updateExecutionIstionComponentLog(executioIstioComponent.ID)
		go mozart.deployer.Deploy(istioManifest.(map[string]interface{}), true, updateExecutionIstioComponent, &wg)
	}

	wg.Wait()
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
		DeployedComponentID: executionComponentID,
		Name:                manifestKey,
		Manifest:            string(manifestBytes),
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
