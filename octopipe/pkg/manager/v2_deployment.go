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
	log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("START:EXECUTE_V2_DEPLOYMENT_PIPELINE")
	err := manager.runV2Deployments(v2Pipeline)
	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_DEPLOYMENTS")
		rollbackErr := manager.runV2Rollbacks(v2Pipeline)
		if rollbackErr != nil {
			log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_ROLLBACKS")
		}
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
		return
	}
	err = manager.runV2ProxyDeployments(v2Pipeline)
	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_PROXY_DEPLOYMENTS")
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
		return
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
	log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("FINISH:EXECUTE_V2_DEPLOYMENT_PIPELINE")
}

func (manager Manager) runV2Deployments(v2Pipeline V2DeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2Deployments", "deployments": v2Pipeline.Deployments}).Info("START:RUN_V2_DEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Deployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, deployment,v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	log.WithFields(log.Fields{"function": "runV2Deployments"}).Info("FINISH:RUN_V2_DEPLOYMENTS")
	return errs.Wait()
}

func (manager Manager) runV2Rollbacks(v2Pipeline V2DeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2Rollbacks", "rollbacks": v2Pipeline.RollbackDeployments}).Info("START:RUN_V2_ROLLBACKS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, rollbackDeployment := range v2Pipeline.RollbackDeployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, rollbackDeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
		})
	}
	log.WithFields(log.Fields{"function": "runV2Rollbacks"}).Info("FINISH:RUN_V2_ROLLBACKS")
	return errs.Wait()
}

func (manager Manager) runV2ProxyDeployments(v2Pipeline V2DeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2ProxyDeployments", "proxyDeployments": v2Pipeline.ProxyDeployments}).Info("START:RUN_V2_PROXY_DEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, proxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	log.WithFields(log.Fields{"function": "runV2ProxyDeployments"}).Info("FINISH:RUN_V2_PROXY_DEPLOYMENTS")
	return errs.Wait()
}