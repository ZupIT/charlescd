/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package mozart

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"
	"sync"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	MaximumRetryRequestAttempts = 5
)

type Mozart struct {
	*MozartManager
	Stages             [][]*pipeline.Step
	CurrentExecutionID *primitive.ObjectID
	//TODO: Add pipeline to struct
}

// TODO: Change deployment to pipeline
func NewMozart(mozartManager *MozartManager, deployment *deployment.Deployment) *Mozart {
	return &Mozart{
		MozartManager: mozartManager,
		Stages:        getStages(deployment),
	}
}

// TODO: Remove deployment param
func (mozart *Mozart) Do(deployment *deployment.Deployment) {
	go mozart.asyncStartPipeline(deployment)
}

func (mozart *Mozart) asyncStartPipeline(deployment *deployment.Deployment) {
	var err error

	mozart.CurrentExecutionID, err = mozart.executions.Create()
	if err != nil {
		utils.CustomLog("error", "asyncStartPipeline", err.Error())
	}

	for _, steps := range mozart.Stages {
		if len(steps) <= 0 {
			continue
		}

		err = mozart.executeSteps(steps)
		if err != nil {
			mozart.returnPipelineError(err)
			break
		}
	}

	mozart.finishPipeline(deployment, err)
}

func (mozart *Mozart) executeSteps(steps []*pipeline.Step) error {
	var waitGroup sync.WaitGroup
	var err error

	for _, step := range steps {
		waitGroup.Add(1)

		go func(step *pipeline.Step) {
			defer waitGroup.Done()

			err = mozart.asyncExecuteStep(step)
		}(step)
	}

	waitGroup.Wait()

	return err
}

func (mozart *Mozart) finishPipeline(pipeline *deployment.Deployment, pipelineError error) {
	err := mozart.executions.ExecutionFinished(mozart.CurrentExecutionID, pipelineError)
	if err != nil {
		utils.CustomLog("error", "executeSteps", err.Error())
		return
	}

	if pipeline.Webhook != "" {
		err = mozart.triggerWebhook(pipeline, pipelineError)
		if err != nil {
			utils.CustomLog("error", "executeSteps", err.Error())
			return
		}
	}

}

func (mozart *Mozart) asyncExecuteStep(step *pipeline.Step) error {
	var err error
	manifests := map[string]interface{}{}

	executionStepID, err := mozart.executions.CreateExecutionStep(
		mozart.CurrentExecutionID, step,
	)
	if err != nil {
		mozart.executions.UpdateExecutionStepStatus(mozart.CurrentExecutionID, executionStepID, execution.StepFailed)
		utils.CustomLog("error", "asyncExecuteStep", err.Error())
		return err
	}

	if step.Manifest != nil {
		manifests["default"] = step.Manifest
		err := mozart.executeManifests(step, manifests)
		if err != nil {
			mozart.executions.UpdateExecutionStepStatus(mozart.CurrentExecutionID, executionStepID, execution.StepFailed)
			utils.CustomLog("error", "asyncExecuteStep", err.Error())
			return err
		}
	}

	if step.Template != nil {
		manifests, err = mozart.getManifestsByTemplateStep(step)
		if err != nil {
			mozart.executions.UpdateExecutionStepStatus(mozart.CurrentExecutionID, executionStepID, execution.StepFailed)
			utils.CustomLog("error", "asyncExecuteStep", err.Error())
			return err
		}
	}

	if len(manifests) <= 0 {
		mozart.executions.UpdateExecutionStepStatus(mozart.CurrentExecutionID, executionStepID, execution.StepFailed)
		utils.CustomLog("error", "asyncExecuteStep", "Not found manifest for execution")
		return errors.New("Not found manifest for execution")
	}

	err = mozart.executeManifests(step, manifests)
	if err != nil {
		mozart.executions.UpdateExecutionStepStatus(mozart.CurrentExecutionID, executionStepID, execution.StepFailed)
		utils.CustomLog("error", "asyncExecuteStep", err.Error())
		return err
	}

	mozart.executions.UpdateExecutionStepStatus(mozart.CurrentExecutionID, executionStepID, execution.StepFinished)

	return nil
}

func (mozart *Mozart) executeManifests(step *pipeline.Step, manifests map[string]interface{}) error {
	var waitGroup sync.WaitGroup
	var err error

	for _, manifest := range manifests {
		waitGroup.Add(1)

		go func(manifest interface{}) {
			defer waitGroup.Done()

			err = mozart.asyncExecuteManifest(step, manifest.(map[string]interface{}))
		}(manifest)
	}

	waitGroup.Wait()

	return err
}

func (mozart *Mozart) asyncExecuteManifest(step *pipeline.Step, manifest map[string]interface{}) error {
	cloudConfig := mozart.cloudprovider.NewCloudProvider(step.K8sConfig)
	resource := &deployer.Resource{
		Action:      step.Action,
		Manifest:    deployer.ToUnstructured(manifest),
		ForceUpdate: step.ForceUpdate,
		Config:      cloudConfig,
		Namespace:   step.Namespace,
	}

	deployer, err := mozart.deployer.NewDeployer(resource)
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

func (mozart *Mozart) getManifestsByTemplateStep(step *pipeline.Step) (map[string]interface{}, error) {
	gitConfig, err := mozart.git.NewGit(step.Git.Provider)
	if err != nil {
		utils.CustomLog("error", "getManifestsByTemplateStep", err.Error())
		return nil, err
	}
	filesData, err := gitConfig.GetDataFromDefaultFiles(step.ModuleName, step.Git.Token, step.Template.Repository)
	if err != nil {
		utils.CustomLog("error", "getManifestsByTemplateStep", err.Error())
		return nil, err
	}
	templateProvider, err := mozart.template.NewTemplate(step.Template.Type)
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

func (mozart *Mozart) triggerWebhook(pipeline *deployment.Deployment, pipelineError error) error {
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
	attempts := 1
	_, err = mozart.SendRequest(request, client,attempts)
	if err != nil {
		utils.CustomLog("error", "triggerWebhook", err.Error())
		return err
	}

	return nil
}

func (mozart *Mozart) returnPipelineError(pipelineError error) {
	err := mozart.executions.ExecutionError(mozart.CurrentExecutionID, pipelineError)
	if err != nil {
		utils.CustomLog("error", "returnPipelineError", err.Error())
	}
}

func (mozart *Mozart) SendRequest(request *http.Request, client http.Client, attempts int) (*http.Response,error) {
	response, err := client.Do(request)
	if err != nil && attempts< MaximumRetryRequestAttempts {
		response, err = mozart.SendRequest(request, client, attempts+1)
	}
	return response, err
}
