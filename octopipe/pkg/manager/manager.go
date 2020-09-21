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

package manager

import (
	"context"
	"errors"
	"fmt"
	pipelinePKG "octopipe/pkg/pipeline"

	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

type Payload struct {
	Status       string `json:"status"`
	CallbackType string `json:"callbackType"`
}

type UseCases interface {
	Start(pipeline pipelinePKG.Pipeline)
}

type Manager struct {
	ManagerMain
}

func (main ManagerMain) NewManager() UseCases {
	return Manager{main}
}

func (manager Manager) Start(pipeline pipelinePKG.Pipeline) {
	go manager.executeStages(pipeline)
}

func (manager Manager) executeV2Deployment(v2Pipeline pipelinePKG.V2Pipeline) {
	log.WithFields(log.Fields{"function": "executeV2Deployment"}).Info("START:EXECUTE_V2_DEPLOYMENT")
	for _, deployment := range v2Pipeline.Deployments {

	}
}

func (manager Manager) executeStages(pipeline pipelinePKG.Pipeline) {
	var err error

	for _, stage := range pipeline.Stages {
		err = manager.executeSteps(pipeline, stage)
		if err != nil {
			break
		}
	}

	if err != nil {
		manager.pipelineOnError(pipeline)
		return
	}

	manager.pipelineOnSuccess(pipeline)
}

func (manager Manager) pipelineOnSuccess(pipeline pipelinePKG.Pipeline) {
	payload := Payload{Status: "SUCCEEDED", CallbackType: pipeline.Webhook.CallbackType}

	manager.triggerWebhook(pipeline, payload)
}

func (manager Manager) pipelineOnError(pipeline pipelinePKG.Pipeline) {
	payload := Payload{Status: "FAILED", CallbackType: pipeline.Webhook.CallbackType}

	manager.triggerWebhook(pipeline, payload)
}

func (manager Manager) executeSteps(pipeline pipelinePKG.Pipeline, stage []pipelinePKG.Step) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, step := range stage {
		currentStep := step
		errs.Go(func() error {
			return manager.executeStep(pipeline, currentStep)
		})
	}

	return errs.Wait()
}

func (manager Manager) getManifestsFromPipeline(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step) (map[string]interface{}, error) {
	defaultManifestKey := "default"
	manifests := map[string]interface{}{}

	if step.Repository.Url != "" {
		var err error
		log.WithFields(log.Fields{"function": "executeStep"}).Info("Step has a template")
		manifests, err = manager.getManifestsbyTemplate(pipeline.Name, step)
		if err != nil {
			return nil, err
		}
	}

	if step.Manifest != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Info("Step has a manifest")
		manifests[defaultManifestKey] = step.Manifest
	}

	if len(manifests) <= 0 {
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Not found manifests for execution")
		return nil, errors.New("Not found manifests for execution")
	}

	return manifests, nil
}

func (manager Manager) executeStep(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step) error {
	var err error

	manifests, err := manager.getManifestsFromPipeline(pipeline, step)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep", "error": err}).Error("Error to get manifests from pipeline")
		return err
	}

	if err := manager.executeManifests(pipeline, step, manifests); err != nil {
		log.WithFields(log.Fields{"function": "executeStep", "error": err.Error()}).Error("Error execute manifests")
		return err
	}

	log.WithFields(log.Fields{"function": "executeStep"}).Info(fmt.Sprintf("Executed %d manifest(s)", len(manifests)))
	log.WithFields(log.Fields{"function": "executeStep"}).Info("Step successfully executed")
	return nil
}

func (manager Manager) executeManifests(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step, manifests map[string]interface{}) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, manifest := range manifests {
		currentManifest := manifest
		errs.Go(func() error {
			return manager.executeManifest(pipeline, step, currentManifest.(map[string]interface{}))
		})
	}

	return errs.Wait()
}

func (manager Manager) executeManifest(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step, manifest map[string]interface{}) error {
	cloudprovider := manager.cloudproviderMain.NewCloudProvider(pipeline.Config)
	config, err := cloudprovider.GetClient()
	if err != nil {
		return err
	}

	deployment := manager.deploymentMain.NewDeployment(
		step.Action,
		step.Update,
		pipeline.Namespace,
		manifest,
		config,
	)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeManifest", "error": err.Error()}).Error("Failed in deployment creation")
		return err
	}

	if err := deployment.Do(); err != nil {
		return err
	}

	return nil
}

func (manager Manager) getFilesFromRepository(name string, step pipelinePKG.Step) (string, string, error) {
	repository, err := manager.repositoryMain.NewRepository(step.Repository)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Error(err.Error())
		return "", "", err
	}
	templateContent, valueContent, err := repository.GetTemplateAndValueByName(name)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Cannot get content by repository. Error: " + err.Error())
		return "", "", err
	}

	return templateContent, valueContent, nil
}

func (manager *Manager) getManifestsbyTemplate(name string, step pipelinePKG.Step) (map[string]interface{}, error) {
	templateContent, valueContent, err := manager.getFilesFromRepository(name, step)
	if err != nil {
		return nil, err
	}

	template, err := manager.templateMain.NewTemplate(step.Template)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Cannot create template main. Error: " + err.Error())
		return nil, err
	}

	manifests, err := template.GetManifests(templateContent, valueContent)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Cannot render manifest by template. Error: " + err.Error())
		return nil, err
	}

	return manifests, nil
}
