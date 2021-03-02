package manager

import (
	"context"
	"octopipe/pkg/customerror"

	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
	"k8s.io/klog"
)

func (manager Manager) ExecuteV2UndeploymentPipeline(v2Pipeline V2UndeploymentPipeline, incomingCircleId string) {

	klog.Info("START UNDEPLOY PIPELINE")

	klog.Info("Render Helm manifests")
	mapManifests := map[string]interface{}{}
	errs, _ := errgroup.WithContext(context.Background())
	for _, deployment := range v2Pipeline.Undeployments {
		deployment := deployment
		errs.Go(func() error {
			manifests, err := manager.getV2HelmManifests(deployment, "teste")
			klog.Info(manifests)
			mapManifests[deployment.ComponentName] = manifests
			return err
		})
	}
	err := errs.Wait()
	if err != nil {
		klog.Info(err)
	}

	klog.Info("REMOVE VIRTUAL-SERVICE AND DESTINATION-RULES")
	err = manager.runV2ProxyUndeployments(v2Pipeline)
	if err != nil {
		manager.handleV2ProxyUndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}

	klog.Info("REMOVE COMPONENTS")
	err = manager.runV2Undeployments(v2Pipeline, mapManifests)
	if err != nil {
		manager.handleV2UndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
}

func (manager Manager) runV2ProxyUndeployments(v2Pipeline V2UndeploymentPipeline) error {
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
