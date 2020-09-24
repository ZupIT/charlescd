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
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"golang.org/x/sync/errgroup"
	"net/http"
	pipelinePKG "octopipe/pkg/pipeline"
)

type V2CallbackData struct {
	Type	string `json:"type"`
	Status	string `json:"status"`
}

const (
	DEPLOYMENT_CALLBACK = "DEPLOYMENT"
	UNDEPLOYMENT_CALLBACK = "UNDEPLOYMENT"
	SUCCEEDED_STATUS = "SUCCEEDED"
	FAILED_STATUS = "FAILED"
	DEPLOY_ACTION = "DEPLOY"
	UNDEPLOY_ACTION = "UNDEPLOY"
)

func (manager Manager) ExecuteV2DeploymentPipeline(v2Pipeline pipelinePKG.V2Pipeline, incomingCircleId string) {
	err := manager.runV2Deployments(v2Pipeline)
	if err != nil {
		manager.runV2Rollbacks(v2Pipeline)
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
	}
	err = manager.runV2ProxyDeployments(v2Pipeline)
	if err != nil {
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
}

func (manager Manager) runV2Deployments(v2Pipeline pipelinePKG.V2Pipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Deployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline, deployment, DEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2Rollbacks(v2Pipeline pipelinePKG.V2Pipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, rollbackDeployment := range v2Pipeline.RollbackDeployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline, rollbackDeployment, UNDEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2ProxyDeployments(v2Pipeline pipelinePKG.V2Pipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline, proxyDeployment, "DEPLOY")
		})
	}
	return errs.Wait()
}

func (manager Manager) executeV2HelmManifests(v2Pipeline pipelinePKG.V2Pipeline, deployment pipelinePKG.V2Deployment, action string) error {
	manifests, err := manager.getV2HelmManifests(deployment)
	if err != nil {
		return err
	}
	err = manager.executeV2Manifests(v2Pipeline, manifests, action)
	if err != nil {
		return err
	}
	return nil
}

func (manager Manager) executeV2Manifests(v2Pipeline pipelinePKG.V2Pipeline, manifests map[string]interface{}, action string) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, manifest := range manifests {
		currentManifest := manifest
		errs.Go(func() error {
			return manager.applyV2Manifest(v2Pipeline, currentManifest.(map[string]interface{}), action)
		})
	}
	return errs.Wait()
}

func (manager Manager) applyV2Manifest(v2Pipeline pipelinePKG.V2Pipeline, manifest map[string]interface{}, action string) error {
	cloudprovider := manager.cloudproviderMain.NewCloudProvider(v2Pipeline.ClusterConfig)
	config, err := cloudprovider.GetClient()
	if err != nil {
		return err
	}

	deployment := manager.deploymentMain.NewDeployment(action, false, v2Pipeline.Namespace, manifest, config)
	err = deployment.Do()
	if err != nil {
		return err
	}
	return nil
}

func (manager Manager) getV2HelmManifests(deployment pipelinePKG.V2Deployment) (map[string]interface{}, error) {
	manifests := map[string]interface{}{}
	manifests, err := manager.getManifestsbyV2Template(deployment)
	if err != nil {
		return nil, err
	}

	if len(manifests) <= 0 {
		return nil, errors.New("Not found manifests for execution")
	}

	return manifests, nil
}

func (manager *Manager) getManifestsbyV2Template(deployment pipelinePKG.V2Deployment) (map[string]interface{}, error) {
	templateContent, valueContent, err := manager.getFilesFromV2Repository(deployment)
	if err != nil {
		return nil, err
	}
	manifests, err := deployment.HelmConfig.GetManifests(templateContent, valueContent)
	if err != nil {
		return nil, err
	}
	return manifests, nil
}

func (manager Manager) getFilesFromV2Repository(deployment pipelinePKG.V2Deployment) (string, string, error) {
	repository, err := manager.repositoryMain.NewRepository(deployment.HelmRepositoryConfig)
	if err != nil {
		return "", "", err
	}
	templateContent, valueContent, err := repository.GetTemplateAndValueByName(deployment.ComponentName)
	if err != nil {
		return "", "", err
	}
	return templateContent, valueContent, nil
}

func (manager Manager) triggerV2Callback(callbackUrl string, callbackType string, status string, incomingCircleId string) {
	client := http.Client{}
	callbackData := V2CallbackData{ callbackType, status }
	request, err := manager.mountV2WebhookRequest(callbackUrl, callbackData, incomingCircleId)
	if err != nil {
		return
	}
	_, err = client.Do(request)
	if err != nil {
		return
	}
}

func (manager Manager) mountV2WebhookRequest(callbackUrl string, payload V2CallbackData, incomingCircleId string) (*http.Request, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	request, err := http.NewRequest("POST", callbackUrl, bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	request.Header.Set("x-circle-id", incomingCircleId)
	return request, nil
}