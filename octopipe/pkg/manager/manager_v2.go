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
	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
	pipelinePKG "octopipe/pkg/pipeline"
)

func (manager Manager) ExecuteV2DeploymentPipeline(v2Pipeline pipelinePKG.V2Pipeline) error {
	log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("START:EXECUTE_V2_PIPELINE")

	err := manager.runV2Deployments(v2Pipeline)
	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("ERROR:EXECUTE_V2_DEPLOYMENT") // TODO log info
		// TODO rollback deployments
		// TODO webhook failure
		return err
	}

	err = manager.runV2ProxyDeployments(v2Pipeline)
	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("ERROR:EXECUTE_V2_PROXY_DEPLOYMENT") // TODO log info
		// TODO webhook failure
		return err
	}

	// TODO webhook success
	log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("FINISH:EXECUTE_V2_PIPELINE")
	return nil
}

func (manager Manager) runV2Deployments(v2Pipeline pipelinePKG.V2Pipeline) error {
	log.WithFields(log.Fields{"function": "runV2Deployments"}).Info("START:RUN_V2_DEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Deployments {
		errs.Go(func() error {
			return manager.executeV2Deployment(v2Pipeline, deployment)
		})
	}
	return errs.Wait()
}

func (manager Manager) executeV2Deployment(v2Pipeline pipelinePKG.V2Pipeline, deployment pipelinePKG.V2Deployment) error {
	// GET DEPLOYMENT MANIFESTS
	manifests, err := manager.getManifestsFromV2Deployment(deployment)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeV2Deployment", "error": err}).Error("ERROR:GET_DEPLOYMENT_MANIFESTS")
		return err
	}
	// EXECUTE DEPLOYMENT
	if err := manager.executeV2DeploymentManifests(v2Pipeline, manifests); err != nil {
		log.WithFields(log.Fields{"function": "executeV2Deployment", "error": err.Error()}).Error("ERROR:EXECUTE_DEPLOYMENT_MANIFEST")
		return err
	}
	return nil
}

func (manager Manager) runV2ProxyDeployments(v2Pipeline pipelinePKG.V2Pipeline) error {
	log.WithFields(log.Fields{"function": "runV2ProxyDeployments"}).Info("START:RUN_V2_PROXY_DEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		errs.Go(func() error {
			return manager.executeV2DeploymentManifests(v2Pipeline, proxyDeployment)
		})
	}
	return errs.Wait()
}

func (manager Manager) getManifestsFromV2Deployment(deployment pipelinePKG.V2Deployment) (map[string]interface{}, error) {
	manifests := map[string]interface{}{}

	log.WithFields(log.Fields{"function": "executeStep"}).Info("Step has a template")
	manifests, err := manager.getManifestsbyV2Template(deployment)
	if err != nil {
		return nil, err
	}

	if len(manifests) <= 0 {
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Not found manifests for execution")
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
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Cannot render manifest by template. Error: " + err.Error())
		return nil, err
	}
	return manifests, nil
}

func (manager Manager) getFilesFromV2Repository(deployment pipelinePKG.V2Deployment) (string, string, error) {
	repository, err := manager.repositoryMain.NewRepository(deployment.HelmRepositoryConfig)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Error(err.Error())
		return "", "", err
	}
	templateContent, valueContent, err := repository.GetTemplateAndValueByName(deployment.ComponentName)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeStep"}).Error("Cannot get content by repository. Error: " + err.Error())
		return "", "", err
	}
	return templateContent, valueContent, nil
}

func (manager Manager) executeV2DeploymentManifests(v2Pipeline pipelinePKG.V2Pipeline, manifests map[string]interface{}) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, manifest := range manifests {
		currentManifest := manifest
		errs.Go(func() error {
			return manager.executeV2Manifest(v2Pipeline, currentManifest.(map[string]interface{}))
		})
	}
	return errs.Wait()
}

func (manager Manager) executeV2Manifest(v2Pipeline pipelinePKG.V2Pipeline, manifest map[string]interface{}) error {
	cloudprovider := manager.cloudproviderMain.NewCloudProvider(v2Pipeline.ClusterConfig)
	config, err := cloudprovider.GetClient()
	if err != nil {
		return err
	}

	deployment := manager.deploymentMain.NewDeployment("DEPLOY", false, v2Pipeline.Namespace, manifest, config)
	err = deployment.Do()
	if err != nil {
		return err
	}

	return nil
}