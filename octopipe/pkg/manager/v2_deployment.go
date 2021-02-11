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

	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

func (manager Manager) ExecuteV2DeploymentPipeline(v2Pipeline V2DeploymentPipeline, incomingCircleId string) {
	err := manager.runV2Deployments(v2Pipeline)
	if err != nil {
		manager.handleV2DeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}
	err = manager.runV2ProxyDeployments(v2Pipeline)
	if err != nil {
		manager.handleV2ProxyDeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
	err = manager.runV2UnusedDeployments(v2Pipeline)
	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_UNUSED_DEPLOYMENTS")
	}
}

func (manager Manager) runV2Deployments(v2Pipeline V2DeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Deployments {
		currentDeployment := deployment
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2Rollbacks(v2Pipeline V2DeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Deployments {
		if deployment.RollbackIfFailed {
			currentRollbackDeployment := deployment
			errs.Go(func() error {
				return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentRollbackDeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
			})
		}
	}
	return errs.Wait()
}

func (manager Manager) runV2ProxyDeployments(v2Pipeline V2DeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		currentProxyDeployment := map[string]interface{}{} // TODO improve this
		currentProxyDeployment["default"] = proxyDeployment
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2UnusedDeployments(v2Pipeline V2DeploymentPipeline) error {

	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.UnusedDeployments {
		currentUnusedDeployment := deployment
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentUnusedDeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) handleV2DeploymentError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	rollbackErr := manager.runV2Rollbacks(v2Pipeline)
	if rollbackErr != nil {
		log.WithFields(log.Fields{"function": "handleV2DeploymentError", "error": err.Error()}).Info("ERROR:RUN_V2_ROLLBACKS")
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2ProxyDeploymentError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}
