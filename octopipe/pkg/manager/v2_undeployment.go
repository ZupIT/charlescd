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

	klog.Info("REMOVE VIRTUAL-SERVICE AND DESTINATION-RULES")
	err := manager.runV2ProxyUndeployments(v2Pipeline)
	if err != nil {
		manager.handleV2ProxyUndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}

	klog.Info("REMOVE COMPONENTS")
	err = manager.runV2Undeployments(v2Pipeline)
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

func (manager Manager) runV2Undeployments(v2Pipeline V2UndeploymentPipeline) error {

	errs, _ := errgroup.WithContext(context.Background())
	for _, undeployment := range v2Pipeline.Undeployments {
		currentUndeployment := undeployment
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
