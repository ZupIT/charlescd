package manager

import (
	"context"
	"octopipe/pkg/customerror"

	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
	"gopkg.in/yaml.v3"
	"k8s.io/klog"
)

func (manager Manager) ExecuteV2UndeploymentPipeline(v2Pipeline V2UndeploymentPipeline, incomingCircleId string) {

	klog.Info("START UNDEPLOY PIPELINE")

	customVirtualServices, helmManifests, err := manager.extractUndeployManifests(v2Pipeline)
	if err != nil {
		manager.handleV2RenderUndeployManifestError(v2Pipeline, err, incomingCircleId)
		return
	}

	klog.Info("REMOVE VIRTUAL-SERVICE AND DESTINATION-RULES")
	err = manager.runV2ProxyUndeployments(v2Pipeline, customVirtualServices)
	if err != nil {
		manager.handleV2ProxyUndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}

	klog.Info("REMOVE COMPONENTS")
	err = manager.runV2Undeployments(v2Pipeline, helmManifests)
	if err != nil {
		manager.handleV2UndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
}

func (manager Manager) extractUndeployManifests(v2Pipeline V2UndeploymentPipeline) (map[string]interface{}, map[string]interface{}, error) {
	klog.Info("Remove Circle and Default circleIDS")
	virtualServiceData, err := manager.removeDataFromProxyDeployments(v2Pipeline.ProxyDeployments)
	if err != nil {
		return nil, nil, err
	}

	klog.Info("Render Helm manifests")
	mapManifests := map[string]interface{}{}
	for _, deployment := range v2Pipeline.Undeployments {
		deployment := deployment // https://golang.org/doc/faq#closures_and_goroutines
		extraVirtualServiceValues := virtualServiceData[deployment.ComponentName]
		d, err := yaml.Marshal(&extraVirtualServiceValues)
		if err != nil {

		}
		manifests, err := manager.getV2HelmManifests(deployment, string(d))
		mapManifests[deployment.ComponentName] = manifests
	}

	customVirtualServices, helmManifests := manager.removeVirtualServiceManifest(mapManifests)
	return customVirtualServices, helmManifests, nil
}

func (manager Manager) runV2ProxyUndeployments(v2Pipeline V2UndeploymentPipeline, customProxyDeployments map[string]interface{}) error {
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		currentProxyDeployment := map[string]interface{}{} // TODO improve this
		currentProxyDeployment["default"] = proxyDeployment
		proxyDeploymentMetadata := proxyDeployment["metadata"].(map[string]interface{})
		customProxyDeployment := customProxyDeployments[proxyDeploymentMetadata["name"].(string)].(map[string]interface{})
		if customProxyDeployment != nil && proxyDeployment["kind"] != "DestinationRule" {
			klog.Info("Applying custom virtual service")
			manager.executeV2Manifests(v2Pipeline.ClusterConfig, customProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		}
		klog.Info("Applying default virtual service")
		err := manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		if err != nil {
			return err
		}
	}
	return nil
}

func (manager Manager) runV2Undeployments(v2Pipeline V2UndeploymentPipeline, mapManifests map[string]interface{}) error {

	errs, _ := errgroup.WithContext(context.Background())
	for _, undeployment := range mapManifests {
		currentUndeployment := undeployment.(map[string]interface{})
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentUndeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
		})
	}

	return errs.Wait()
}

func (manager Manager) handleV2ProxyUndeploymentError(v2Pipeline V2UndeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)

}

func (manager Manager) handleV2UndeploymentError(v2Pipeline V2UndeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}

func (manager Manager) handleV2RenderUndeployManifestError(v2Pipeline V2UndeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(customerror.WithLogFields(err)).Error()
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, DEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
}
