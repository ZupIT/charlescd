package mozart

import (
	"encoding/json"
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
	Start(pipeline *pipeline.Pipeline)
}

func NewMozart(deployer deployer.UseCases, executionMain execution.UseCases) *Mozart {
	return &Mozart{deployer, executionMain, nil}
}

func (mozart *Mozart) Start(pipeline *pipeline.Pipeline) {
	mozart.createExecutionLog(pipeline)
	mozart.deployComponentsToCluster(pipeline)
	mozart.deployIstioComponentsToCluster(pipeline)
	mozart.finishExecutionLog()
}

func (mozart *Mozart) triggerWebhook() {
}

func (mozart *Mozart) deployComponentsToCluster(pipeline *pipeline.Pipeline) {
	for _, component := range pipeline.Versions {
		executionComponent := mozart.createExecutionComponentLog(component)
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
		executionManifest := mozart.createExecutionManifestLog(executionComponent.ID, manifestKey, manifest)
		updateExecutionManifest := mozart.updateExecutionManifestLog(executionManifest.ID, executionComponent.ID)
		go mozart.deployer.Deploy(manifest.(map[string]interface{}), false, updateExecutionManifest, &wg)
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

func (mozart *Mozart) createExecutionLog(pipeline *pipeline.Pipeline) {
	newExecution := &execution.Execution{
		Name:      pipeline.Name,
		Namespace: pipeline.Namespace,
		Author:    pipeline.GithubAccount.Username,
		StartTime: time.Now(),
		Webhook:   pipeline.Webhook,
		HelmURL:   pipeline.HelmRepository,
	}

	mozart.currentExecution, _ = mozart.executionMain.Create(newExecution)
}

func (mozart *Mozart) updateExecutionLog(status string) {
	id := mozart.currentExecution.ID.String()
	mozart.executionMain.UpdateStatus(id, status)
}

func (mozart *Mozart) finishExecutionLog() {
	id := mozart.currentExecution.ID.String()
	mozart.executionMain.FinishExecution(id)
}

func (mozart *Mozart) createExecutionComponentLog(component *pipeline.Version) *execution.DeployedComponent {
	newComponent := &execution.DeployedComponent{
		ExecutionID: mozart.currentExecution.ID,
		Name:        component.Version,
		ImageURL:    component.VersionURL,
	}
	deployedComponent, _ := mozart.executionMain.CreateComponent(newComponent)

	return deployedComponent
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

func (mozart *Mozart) createExecutionManifestLog(executionComponentID uuid.UUID, manifestKey string, manifest interface{}) *execution.DeployedComponentManifest {
	manifestBytes, _ := json.Marshal(&manifest)

	newManifest := &execution.DeployedComponentManifest{
		DeployedComponentID: executionComponentID,
		Name:                manifestKey,
		Manifest:            string(manifestBytes),
	}

	executionManifest, _ := mozart.executionMain.CreateManifest(newManifest)
	return executionManifest
}

func (mozart *Mozart) updateExecutionManifestLog(id uuid.UUID, executionComponentID uuid.UUID) func(string) {
	return func(status string) {
		mozart.executionMain.UpdateManifestStatus(id, executionComponentID, status)
	}
}

func (mozart *Mozart) updateExecutionIstionComponentLog(id uuid.UUID) func(string) {
	return func(status string) {
		mozart.executionMain.UpdateIstioComponentStatus(id, mozart.currentExecution.ID, status)
	}
}
