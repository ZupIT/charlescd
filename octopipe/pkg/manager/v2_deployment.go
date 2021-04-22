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
	"gopkg.in/yaml.v3"
	"k8s.io/klog"
	"octopipe/pkg/customerror"
)

func (manager Manager) ExecuteV2DeploymentPipeline(v2Pipeline V2DeploymentPipeline, incomingCircleId string) {


	manager.logAggregator.AppendInfoAndLog("Starting deploy pipeline")
	customVirtualServices, helmManifests, err := manager.extractManifests(v2Pipeline)
	if err != nil {
		manager.handleV2RenderManifestError(v2Pipeline, err, incomingCircleId)
		return
	}

	manager.logAggregator.AppendInfoAndLog("Applying components")

	err = manager.runV2Deployments(v2Pipeline, helmManifests)
	if err != nil {
		manager.handleV2DeploymentError(v2Pipeline, err, incomingCircleId, helmManifests)
		return
	}

	manager.logAggregator.AppendInfoAndLog("Applying virtual service and destination rules")

	err = manager.runV2ProxyDeployments(v2Pipeline, customVirtualServices)
	if err != nil {
		manager.handleV2ProxyDeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}

	manager.logAggregator.AppendInfoAndLog("Remove Circle and Default circleIDS from unusedProxyDeployments")
	virtualServiceUnusedDeploymentsData, err := manager.removeDataFromProxyDeployments(v2Pipeline.UnusedProxyDeployments)
	if err != nil {
		manager.handleV2RenderManifestError(v2Pipeline, err, incomingCircleId)
		return
	}

	manager.logAggregator.AppendInfoAndLog("Rendering unused Helm manifests")

	mapUnusedManifests := map[string]interface{}{}
	for _, deployment := range v2Pipeline.UnusedDeployments {
		deployment := deployment // https://golang.org/doc/faq#closures_and_goroutines
		extraVirtualService := virtualServiceUnusedDeploymentsData[deployment.ComponentName]
		klog.Info(extraVirtualService)
		d, err := yaml.Marshal(&extraVirtualService)
		if err != nil {
			manager.handleV2RenderManifestError(v2Pipeline, err, incomingCircleId)
			return
		}
		manifests, err := manager.getV2HelmManifests(deployment, string(d))
		if err != nil {
			manager.handleV2RenderManifestError(v2Pipeline, err, incomingCircleId)
			return
		}
		mapUnusedManifests[deployment.ComponentName] = manifests
	}

	customUnusedVirtualServices, helmUnusedManifests := manager.removeVirtualServiceManifest(mapUnusedManifests)

	manager.logAggregator.AppendInfoAndLog("Applying unused virtual service and destination rules")
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

func (manager Manager) extractManifests(v2Pipeline V2DeploymentPipeline) (map[string]interface{}, map[string]interface{}, error) {

	manager.logAggregator.AppendInfoAndLog("Removing circle and default circle ids")
	virtualServiceData, err := manager.removeDataFromProxyDeployments(v2Pipeline.ProxyDeployments)
	if err != nil {
		return nil, nil, err
	}

	manager.logAggregator.AppendInfoAndLog("Rendering helm manifests")
	mapManifests := map[string]interface{}{}
	for _, deployment := range v2Pipeline.Deployments {
		deployment := deployment // https://golang.org/doc/faq#closures_and_goroutines
		extraVirtualServiceValues := virtualServiceData[deployment.ComponentName]
		d, err := yaml.Marshal(&extraVirtualServiceValues)
		if err != nil {
			return nil, nil, err
		}
		manifests, err := manager.getV2HelmManifests(deployment, string(d))
		if err != nil {
			return nil, nil, err
		}
		mapManifests[deployment.ComponentName] = manifests
	}

	customVirtualServices, helmManifests := manager.removeVirtualServiceManifest(mapManifests)
	return customVirtualServices, helmManifests, nil
}

func (manager Manager) runV2Deployments(v2Pipeline V2DeploymentPipeline, mapManifests map[string]interface{}) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range mapManifests {
		currentDeployment := deployment.(map[string]interface{})
		cloudprovider := manager.cloudproviderMain.NewCloudProvider(v2Pipeline.ClusterConfig)
		config, err := cloudprovider.GetClient()
		if err != nil {
			return err
		}
		for _, manifest := range currentDeployment {
			deployment := manager.deploymentMain.NewDeployment(DEPLOY_ACTION, false, v2Pipeline.Namespace, manifest.(map[string]interface{}), config, manager.kubectl, manager.logAggregator)
			err := deployment.Deploy()
			if err != nil {
				return err
			}

			errs.Go(func() error {
				return deployment.NewWatcher()
			})
		}
	}

	return errs.Wait()
}

func (manager Manager) runV2Rollbacks(v2Pipeline V2DeploymentPipeline, mapManifests map[string]interface{}) error {
	errs, _ := errgroup.WithContext(context.Background())
	for key, manifest := range mapManifests {
		rollbackIfFailed := false
		for _, deployment := range v2Pipeline.Deployments {
			if deployment.ComponentName == key && deployment.RollbackIfFailed {
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
			manager.logAggregator.AppendInfoAndLog("Applying custom virtual service")
			manager.executeV2Manifests(v2Pipeline.ClusterConfig, customProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		}
		manager.logAggregator.AppendInfoAndLog("Applying default virtual service")

		err := manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		if err != nil {
			return err
		}
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
			manager.logAggregator.AppendInfoAndLog("Applying custom virtual service")
			manager.executeV2Manifests(v2Pipeline.ClusterConfig, customProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		}

		err := manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		if err != nil {
			return err
		}
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
	manager.logAggregator.AppendErrorAndLog(err)
	rollbackErr := manager.runV2Rollbacks(v2Pipeline, mapManifests)
	if rollbackErr != nil {
		manager.logAggregator.AppendErrorAndLog(rollbackErr)
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2RemoveDataError(v2Pipeline V2DeploymentPipeline, errList []error, incomingCircleId string) {
	for _, err := range errList {
		manager.logAggregator.AppendErrorAndLog(err)
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2RenderManifestError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	manager.logAggregator.AppendErrorAndLog(err)
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId,)
}

func (manager Manager) handleV2ManifestsError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	manager.logAggregator.AppendErrorAndLog(err)
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2ProxyDeploymentError(v2Pipeline V2DeploymentPipeline, err error, incomingCircleId string) {
	manager.logAggregator.AppendErrorAndLog(err)
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}
