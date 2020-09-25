package manager

import (
	"context"
	"golang.org/x/sync/errgroup"
)

func (manager Manager) ExecuteV2UndeploymentPipeline(v2Pipeline V2UndeploymentPipeline, incomingCircleId string) {
	err := manager.runV2ProxyUndeployments(v2Pipeline)
	if err != nil {
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
	}
	err = manager.runV2Undeployments(v2Pipeline)
	if err != nil {
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
}

func (manager Manager) runV2ProxyUndeployments(v2Pipeline V2UndeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, proxyDeployment, v2Pipeline.Namespace, "DEPLOY")
		})
	}
	return errs.Wait()
}

func (manager Manager) runV2Undeployments(v2Pipeline V2UndeploymentPipeline) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.Undeployments {
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, proxyDeployment, v2Pipeline.Namespace, "DEPLOY")
		})
	}
	return errs.Wait()
}