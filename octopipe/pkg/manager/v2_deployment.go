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
	"golang.org/x/sync/errgroup"
)

func (manager Manager) ExecuteV2DeploymentPipeline(v2Pipeline V2DeploymentPipeline, incomingCircleId string) {
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

func (manager Manager) runV2Deployments(v2Pipeline V2DeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Deployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, deployment,v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2Rollbacks(v2Pipeline V2DeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, rollbackDeployment := range v2Pipeline.RollbackDeployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, rollbackDeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2ProxyDeployments(v2Pipeline V2DeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, proxyDeployment, v2Pipeline.Namespace, "DEPLOY")
		})
	}
	return errs.Wait()
}