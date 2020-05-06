package mozart

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
	"octopipe/pkg/git"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/template"
	"octopipe/pkg/utils"
	"sync"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MozartPipeline struct {
	*Mozart
	Stages             [][]*pipeline.Step
	CurrentExecutionID *primitive.ObjectID
	//TODO: Add pipeline to struct
}

// TODO: Change deployment to pipeline
func NewMozartPipeline(mozart *Mozart, deployment *deployment.Deployment) *MozartPipeline {
	return &MozartPipeline{
		Mozart: mozart,
		Stages: getStages(deployment),
	}
}

// TODO: Remove deployment param
func (mozartPipeline *MozartPipeline) Do(deployment *deployment.Deployment) {
	go mozartPipeline.asyncStartPipeline(deployment)
}

func (mozartPipeline *MozartPipeline) asyncStartPipeline(deployment *deployment.Deployment) {
	var err error

	mozartPipeline.CurrentExecutionID, err = mozartPipeline.executions.Create()
	if err != nil {
		utils.CustomLog("error", "asyncStartPipeline", err.Error())
	}

	for _, steps := range mozartPipeline.Stages {
		if len(steps) <= 0 {
			continue
		}

		err = mozartPipeline.executeSteps(steps)
		if err != nil {
            mozartPipeline.returnPipelineError(err)
			break
		}
	}

	mozartPipeline.finishPipeline(deployment, err)
}

func (mozartPipeline *MozartPipeline) executeSteps(steps []*pipeline.Step) error {
	var waitGroup sync.WaitGroup
	fatalErr := make(chan error)
	done := make(chan bool)

	for _, step := range steps {
		waitGroup.Add(1)

		go func(step *pipeline.Step) {
			defer waitGroup.Done()

			err := mozartPipeline.asyncExecuteStep(step)
			if err != nil {
				fatalErr <- err
			}
		}(step)
	}

	go func() {
		waitGroup.Wait()
		close(done)
	}()

	select {
	case <-done:
		return nil
	case err := <-fatalErr:
		return err
	}
}

func (mozartPipeline *MozartPipeline) finishPipeline(pipeline *deployment.Deployment, pipelineError error) {
	err := mozartPipeline.executions.ExecutionFinished(mozartPipeline.CurrentExecutionID)
	if err != nil {
		utils.CustomLog("error", "executeSteps", err.Error())
		return
	}

	if pipeline.Webhook != "" {
		err = mozartPipeline.triggerWebhook(pipeline, pipelineError)
		if err != nil {
			utils.CustomLog("error", "executeSteps", err.Error())
			return
		}
	}

}

func (mozartPipeline *MozartPipeline) asyncExecuteStep(step *pipeline.Step) error {
	var err error
	manifests := map[string]interface{}{}

	executionStepID, err := mozartPipeline.executions.CreateExecutionStep(
		mozartPipeline.CurrentExecutionID, step,
	)
	if err != nil {
		mozartPipeline.executions.UpdateExecutionStepStatus(mozartPipeline.CurrentExecutionID, executionStepID, execution.StepFailed)
		utils.CustomLog("error", "asyncExecuteStep::CreateExecutionStep", err.Error())
		return err
	}

	if step.Manifest != nil {
		manifests["default"] = step.Manifest
		err := mozartPipeline.executeManifests(step, manifests)
		if err != nil {
			mozartPipeline.executions.UpdateExecutionStepStatus(mozartPipeline.CurrentExecutionID, executionStepID, execution.StepFailed)
			utils.CustomLog("error", "asyncExecuteStep::executeManifests", err.Error())
			return err
		}
	}

	if step.Template != nil {
		manifests, err = mozartPipeline.getManifestsByTemplateStep(step)
		if err != nil {
			mozartPipeline.executions.UpdateExecutionStepStatus(mozartPipeline.CurrentExecutionID, executionStepID, execution.StepFailed)
			utils.CustomLog("error", "asyncExecuteStep::getManifestsByTemplateStep", err.Error())
			return err
		}
	}

	if len(manifests) <= 0 {
		mozartPipeline.executions.UpdateExecutionStepStatus(mozartPipeline.CurrentExecutionID, executionStepID, execution.StepFailed)
		utils.CustomLog("error", "asyncExecuteStep", "Not found manifest for execution")
		return errors.New("Not found manifest for execution")
	}

	err = mozartPipeline.executeManifests(step, manifests)
	if err != nil {
		mozartPipeline.executions.UpdateExecutionStepStatus(mozartPipeline.CurrentExecutionID, executionStepID, execution.StepFailed)
		utils.CustomLog("error", "asyncExecuteStep::executeManifests", err.Error())
		return err
	}

	mozartPipeline.executions.UpdateExecutionStepStatus(mozartPipeline.CurrentExecutionID, executionStepID, execution.StepFinished)

	return nil
}

func (mozartPipeline *MozartPipeline) executeManifests(step *pipeline.Step, manifests map[string]interface{}) error {
	var waitGroup sync.WaitGroup
	var err error

	for _, manifest := range manifests {
		waitGroup.Add(1)

		go func(manifest interface{}) {
			defer waitGroup.Done()

			err = mozartPipeline.asyncExecuteManifest(step, manifest.(map[string]interface{}))
		}(manifest)
	}

	waitGroup.Wait()

	return err
}

func (mozartPipeline *MozartPipeline) asyncExecuteManifest(step *pipeline.Step, manifest map[string]interface{}) error {
	cloudConfig := cloudprovider.NewCloudProvider(step.K8sConfig)
	resource := &deployer.Resource{
		Action:      step.Action,
		Manifest:    deployer.ToUnstructured(manifest),
		ForceUpdate: step.ForceUpdate,
		Config:      cloudConfig,
		Namespace:   step.Namespace,
	}

	deployer, err := deployer.NewDeployer(resource)
	if err != nil {
		utils.CustomLog("error", "asyncExecuteManifest", err.Error())
		return err
	}

	err = deployer.Do()
	if err != nil {
		utils.CustomLog("error", "asyncExecuteManifest", err.Error())
		return err
	}

	return nil
}

func (mozartPipeline *MozartPipeline) getManifestsByTemplateStep(step *pipeline.Step) (map[string]interface{}, error) {
	gitConfig, err := git.NewGit(step.Git.Provider)
	if err != nil {
		utils.CustomLog("error", "getManifestsByTemplateStep", err.Error())
		return nil, err
	}
	filesData, err := gitConfig.GetDataFromDefaultFiles(step.ModuleName, step.Git.Token, step.Template.Repository)
	if err != nil {
		utils.CustomLog("error", "getManifestsByTemplateStep", err.Error())
		return nil, err
	}
	templateProvider, err := template.NewTemplate(step.Template.Type)
	if err != nil {
		utils.CustomLog("error", "getManifestsByTemplateStep", err.Error())
		return nil, err
	}

	manifests, err := templateProvider.GetManifests(filesData[0], filesData[1], step.Template.Override)
	if err != nil {
		utils.CustomLog("error", "getManifestsByTemplateStep", err.Error())
		return nil, err
	}

	return manifests, nil
}

func (mozartPipeline *MozartPipeline) triggerWebhook(pipeline *deployment.Deployment, pipelineError error) error {
	var payload map[string]string
	client := http.Client{}

	if pipelineError != nil {
		payload = map[string]string{"status": "FAILED"}
	} else {
		payload = map[string]string{"status": "SUCCEEDED"}
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	request, err := http.NewRequest("POST", pipeline.Webhook, bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	request.Header.Set("x-circle-id", pipeline.CircleID)
	request.Header.Set("Content-Type", "application/json")

	_, err = client.Do(request)
	if err != nil {
		utils.CustomLog("error", "triggerWebhook", err.Error())
		return err
	}

	return nil
}

func (mozartPipeline *MozartPipeline) returnPipelineError(pipelineError error) {
	err := mozartPipeline.executions.ExecutionError(mozartPipeline.CurrentExecutionID, pipelineError)
	if err != nil {
		utils.CustomLog("error", "returnPipelineError", err.Error())
	}
}
