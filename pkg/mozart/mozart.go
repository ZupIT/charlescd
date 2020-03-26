package mozart

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"k8s.io/apimachinery/pkg/runtime/schema"

	"golang.org/x/sync/errgroup"
)

type MozartSteps struct {
	doneManageVersions        chan error
	doneManageIstioComponents chan error
}

type Mozart struct {
	deployer           deployer.UseCases
	executionMain      execution.UseCases
	currentExecutionID *primitive.ObjectID
	steps              *MozartSteps
}

type UseCases interface {
	Start(pipeline *pipeline.Pipeline) (*primitive.ObjectID, error)
}

func NewMozart(deployer deployer.UseCases, executionMain execution.UseCases) *Mozart {
	steps := &MozartSteps{make(chan error), make(chan error)}
	return &Mozart{deployer, executionMain, nil, steps}
}

func (mozart *Mozart) Start(pipeline *pipeline.Pipeline) (*primitive.ObjectID, error) {
	var err error

	mozart.currentExecutionID, err = mozart.executionMain.Create(pipeline)
	if err != nil {
		return nil, err
	}
	mozart.firstPipelineStep(pipeline)
	mozart.stepsManager(pipeline)

	return mozart.currentExecutionID, nil
}

func (mozart *Mozart) stepsManager(pipeline *pipeline.Pipeline) {
	go func() {
		for {
			select {
			case err := <-mozart.steps.doneManageVersions:
				if err != nil {
					mozart.finishPipeline(pipeline, execution.ExecutionFailed)
					return
				} else {
					mozart.startManageIstioComponents(pipeline)

				}
			case err := <-mozart.steps.doneManageIstioComponents:
				if err != nil {
					mozart.finishPipeline(pipeline, execution.ExecutionFailed)
					return
				} else {
					mozart.finishPipeline(pipeline, execution.ExecutionFinished)
				}
				return
			}
		}
	}()
}

func (mozart *Mozart) firstPipelineStep(pipeline *pipeline.Pipeline) {
	mozart.startManageVersions(pipeline)
}

func (mozart *Mozart) startManageVersions(pipeline *pipeline.Pipeline) {
	go mozart.manageVersions(pipeline)
}

func (mozart *Mozart) startManageIstioComponents(pipeline *pipeline.Pipeline) {
	go mozart.manageIstioComponents(pipeline)
}

func (mozart *Mozart) manageVersions(pipeline *pipeline.Pipeline) {
	var err error

	err = mozart.manageDeployVersions(pipeline)
	err = mozart.manageUndeployVersions(pipeline, context.Background())

	if err != nil {
		mozart.steps.doneManageVersions <- err
		return
	}

	mozart.steps.doneManageVersions <- nil
}

func (mozart *Mozart) manageIstioComponents(pipeline *pipeline.Pipeline) {
	var err error
	utils.CustomLog("info", "manageIstioComponents", "START ISTIO DEPLOY...")
	err = mozart.deployVirtualService(pipeline, context.Background())
	err = mozart.deployDestinationRules(pipeline, context.Background())
	if err != nil {
		mozart.steps.doneManageIstioComponents <- err
		return
	}

	mozart.steps.doneManageIstioComponents <- nil
}

func (mozart *Mozart) deployVirtualService(pipeline *pipeline.Pipeline, ctx context.Context) error {
	forceUpdate := true
	virtualServiceSchema := schema.GroupVersionResource{
		Group:    "networking.istio.io",
		Version:  "v1alpha3",
		Resource: "virtualservices",
	}

	if pipeline.Istio.VirtualService == nil {
		return nil
	}
	utils.CustomLog("info", "deployVirtualService", "DEPLOY: VIRTUAL SERVICE")
	mozart.executionMain.CreateIstioComponent(
		mozart.currentExecutionID, "virtualService", pipeline.Istio.VirtualService,
	)
	errs, ctx := errgroup.WithContext(ctx)
	errs.Go(func() error {
		err := mozart.deployer.Deploy(pipeline.Istio.VirtualService, forceUpdate, &virtualServiceSchema)
		if err != nil {
			mozart.steps.doneManageIstioComponents <- err
			return err
		}
		return nil
	})
	return errs.Wait()
}

func (mozart *Mozart) deployDestinationRules(pipeline *pipeline.Pipeline, ctx context.Context) error {
	forceUpdate := true
	destinationRulesSchema := schema.GroupVersionResource{
		Group:    "networking.istio.io",
		Version:  "v1alpha3",
		Resource: "destinationrules",
	}

	if pipeline.Istio.DestinationRules == nil {
		return nil
	}
	utils.CustomLog("info", "deployDestinationRules", "DEPLOY: DESTINATION RULES")
	mozart.executionMain.CreateIstioComponent(
		mozart.currentExecutionID, "destinationRules", pipeline.Istio.DestinationRules,
	)
	errs, ctx := errgroup.WithContext(ctx)
	errs.Go(func() error {
		err := mozart.deployer.Deploy(pipeline.Istio.DestinationRules, forceUpdate, &destinationRulesSchema)
		if err != nil {
			mozart.steps.doneManageIstioComponents <- err
			return err
		}
		return nil
	})

	return errs.Wait()
}

func (mozart *Mozart) finishPipeline(pipeline *pipeline.Pipeline, status string) {
	data, err := json.Marshal(map[string]string{
		"status": status,
	})
	if err != nil {
		return
	}

	_, err = http.Post(pipeline.Webhook, "application/json", bytes.NewBuffer(data))
	if err != nil {
		mozart.executionMain.FinishExecution(mozart.currentExecutionID, execution.ExecutionWebhookFailed)
		utils.CustomLog("error", "triggerWebhook", err.Error())
		return
	}

	mozart.executionMain.FinishExecution(mozart.currentExecutionID, status)
}

func (mozart *Mozart) triggerWebhook() {

}

func (mozart *Mozart) manageDeployVersions(pipeline *pipeline.Pipeline) error {
	utils.CustomLog("info", "manageDeployVersions", "START VERSIONS DEPLOY...")
	for _, version := range pipeline.Versions {
		err := mozart.deployVersion(pipeline, version, context.Background())
		if err != nil {
			mozart.steps.doneManageVersions <- err
			return err
		}
	}

	return nil
}

func (mozart *Mozart) deployVersion(pipeline *pipeline.Pipeline, version *pipeline.Version, ctx context.Context) error {
	errs, ctx := errgroup.WithContext(ctx)

	manifests, err := mozart.deployer.GetManifestsByHelmChart(pipeline, version)
	if err != nil {
		utils.CustomLog("error", "deployVersion", err.Error())
		return err
	}

	utils.CustomLog("info", "deployVersion", "DEPLOY VERSION: "+version.Version)
	executionVersionID, _ := mozart.executionMain.CreateVersion(mozart.currentExecutionID, version)
	for key, manifest := range manifests {
		func(key string, manifest interface{}) {
			errs.Go(func() error {
				executionManifestID, _ := mozart.executionMain.CreateVersionManifest(
					mozart.currentExecutionID, executionVersionID, key, manifest,
				)
				err := mozart.deployer.Deploy(manifest.(map[string]interface{}), false, nil)
				if err != nil {
					mozart.executionMain.UpdateManifestStatus(
						mozart.currentExecutionID, executionVersionID, executionManifestID, execution.ExecutionFailed,
					)
					return err
				}

				mozart.executionMain.UpdateManifestStatus(
					mozart.currentExecutionID, executionVersionID, executionManifestID, execution.ManifestDeployed,
				)
				return nil
			})
		}(key, manifest)
	}

	return errs.Wait()
}

func (mozart *Mozart) manageUndeployVersions(pipeline *pipeline.Pipeline, ctx context.Context) error {
	utils.CustomLog("info", "manageUndeployVersions", "START VERSIONS UNDEPLOY...")

	errs, ctx := errgroup.WithContext(ctx)
	for _, version := range pipeline.UnusedVersions {
		func(name string, namespace string) {
			utils.CustomLog("info", "manageUndeployVersions", "UNDEPLOY VERSION: "+name)
			errs.Go(func() error {
				err := mozart.deployer.Undeploy(version.Version, pipeline.Namespace)
				if err != nil {
					return err
				}

				mozart.executionMain.CreateUnusedVersion(mozart.currentExecutionID, name)

				return nil
			})
		}(version.Version, pipeline.Namespace)
	}

	return errs.Wait()
}
