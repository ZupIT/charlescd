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
	"octopipe/pkg/customerror"

	"gopkg.in/yaml.v3"
	"k8s.io/klog"

	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

func (manager Manager) ExecuteV2DeploymentPipeline(v2Pipeline V2DeploymentPipeline, incomingCircleId string) {
	klog.Info("START PIPELINE")

	klog.Info("Remove Circle and Default circleIDS")
	virtualServiceData, errList := manager.removeDataFromProxyDeployments(v2Pipeline.ProxyDeployments)
	if len(errList) > 0 {
		manager.handleV2RemoveDataError(v2Pipeline, errList, incomingCircleId)
		return
	}

	klog.Info("Render Helm manifests")
	mapManifests := map[string]interface{}{}
	for _, deployment := range v2Pipeline.Deployments {
		deployment := deployment // https://golang.org/doc/faq#closures_and_goroutines
		extraVirtualServiceValues := virtualServiceData[deployment.ComponentName]
		d, err := yaml.Marshal(&extraVirtualServiceValues)
		if err != nil {
			manager.handleV2RenderManifestError(v2Pipeline, err, incomingCircleId)
			return
		}
		manifests, err := manager.getV2HelmManifests(deployment, string(d))
		mapManifests[deployment.ComponentName] = manifests
	}

	customVirtualServices, helmManifests := manager.removeVirtualServiceManifest(mapManifests)

	klog.Info("APPLY COMPONENTS")
	err := manager.runV2Deployments(v2Pipeline, helmManifests)
	if err != nil {
		manager.handleV2DeploymentError(v2Pipeline, err, incomingCircleId, helmManifests)
		return
	}

	klog.Info("APPLY VIRTUAL-SERVICE AND DESTINATION-RULES")
	err = manager.runV2ProxyDeployments(v2Pipeline, customVirtualServices)
	if err != nil {
		manager.handleV2ProxyDeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}

	klog.Info("Remove Circle and Default circleIDS from unusedProxyDeployments")
	virtualServiceUnusedDeploymentsData, errList := manager.removeDataFromProxyDeployments(v2Pipeline.UnusedProxyDeployments)
	if len(errList) > 0 {
		manager.handleV2RemoveDataError(v2Pipeline, errList, incomingCircleId)
		return
	}

	klog.Info("Render unused Helm manifests")
	mapUnusedManifests := map[string]interface{}{}
	for _, deployment := range v2Pipeline.UnusedDeployments {
		deployment := deployment // https://golang.org/doc/faq#closures_and_goroutines
		batata := virtualServiceUnusedDeploymentsData[deployment.ComponentName]
		klog.Info(batata)
		d, err := yaml.Marshal(&batata)
		if err != nil {
			manager.handleV2RenderManifestError(v2Pipeline, err, incomingCircleId)
			return
		}
		manifests, err := manager.getV2HelmManifests(deployment, string(d))
		mapUnusedManifests[deployment.ComponentName] = manifests
		return
	}

	customUnusedVirtualServices, helmUnusedManifests := manager.removeVirtualServiceManifest(mapUnusedManifests)

	klog.Info("APPLY UNUSED VIRTUAL-SERVICE AND DESTINATION-RULES")
	err = manager.runV2unusedProxyDeployments(v2Pipeline, customUnusedVirtualServices)
	if err != nil {
		manager.handleV2ProxyDeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}

	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)

	klog.Info("REMOVE UNUSED DEPLOYMENTS")
	err = manager.runV2UnusedDeployments(v2Pipeline, helmUnusedManifests)
	if err != nil {
		log.WithFields(customerror.WithLogFields(err)).Error()
	}

	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_UNUSED_PROXY_DEPLOYMENTS")
	}
	log.WithFields(log.Fields{"function": "ExecuteV2DeploymentPipeline"}).Info("FINISH:EXECUTE_V2_DEPLOYMENT_PIPELINE")
}

func (manager Manager) runV2Deployments(v2Pipeline V2DeploymentPipeline, mapManifests map[string]interface{}) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range mapManifests {
		currentDeployment := deployment.(map[string]interface{})
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2Rollbacks(v2Pipeline V2DeploymentPipeline, mapManifests map[string]interface{}) error {
	errs, _ := errgroup.WithContext(context.Background())
	for chave, manifest := range mapManifests {
		rollbackIfFailed := false
		for _, deployment := range v2Pipeline.Deployments {
			if deployment.ComponentName == chave && deployment.RollbackIfFailed {
				rollbackIfFailed = true
			}
		}
		if rollbackIfFailed {
			currentRollbackDeployment := manifest.(map[string]interface{})
			errs.Go(func() error {
				return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentRollbackDeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
			})
		}
	}
	return errs.Wait()
}

func (manager Manager) runV2ProxyDeployments(v2Pipeline V2DeploymentPipeline, customProxyDeployments map[string]interface{}) error {
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		currentProxyDeployment := map[string]interface{}{} // TODO improve this
		currentProxyDeployment["default"] = proxyDeployment
		proxyDeploymentMetadata := proxyDeployment["metadata"].(map[string]interface{})
		customProxyDeployment := customProxyDeployments[proxyDeploymentMetadata["name"].(string)].(map[string]interface{})
		if customProxyDeployment != nil {
			klog.Info("Applying custom virtual service")
			manager.executeV2Manifests(v2Pipeline.ClusterConfig, customProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		}
		klog.Info("Applying default virtual service")
		return manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
	}
	return nil
}

func (manager Manager) runV2unusedProxyDeployments(v2Pipeline V2DeploymentPipeline, customUnusedVirtualServices map[string]interface{}) error {
	log.WithFields(log.Fields{"function": "runV2unusedProxyDeployments", "unusedProxyDeployments": v2Pipeline.UnusedProxyDeployments}).Info("START:RUN_V2_UNUSED_PROXY_DEPLOYMENTS")
	for _, proxyDeployment := range v2Pipeline.UnusedProxyDeployments {
		currentProxyDeployment := map[string]interface{}{} // TODO improve this
		currentProxyDeployment["default"] = proxyDeployment
		proxyDeploymentMetadata := proxyDeployment["metadata"].(map[string]interface{})
		customProxyDeployment := customUnusedVirtualServices[proxyDeploymentMetadata["name"].(string)].(map[string]interface{})
		if customProxyDeployment != nil {
			klog.Info("Applying unused custom virtual service")
			manager.executeV2Manifests(v2Pipeline.ClusterConfig, customProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		}

		return manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
	}
	return nil
}

func (manager Manager) runV2UnusedDeployments(v2Pipeline V2DeploymentPipeline, mapManifests map[string]interface{}) error {

	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range mapManifests {
		currentUnusedDeployment := deployment.(map[string]interface{})
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentUnusedDeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
		})
	}
	return errs.Wait()
}

func (manager Manager) handleV2DeploymentError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string, mapManifests map[string]interface{}) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	rollbackErr := manager.runV2Rollbacks(v2Pipeline, mapManifests)
	if rollbackErr != nil {
		log.WithFields(customerror.WithLogFields(rollbackErr, "manager.handleV2DeploymentError.runV2Rollbacks")).Error()
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2RemoveDataError(v2Pipeline V2DeploymentPipeline, errList []error, incomingCircleId string) {
	for _, err := range errList {
		log.WithFields(customerror.WithLogFields(err)).Error()
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2RenderManifestError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2ManifestsError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2ProxyDeploymentError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}
