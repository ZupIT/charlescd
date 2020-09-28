package manager

import (
	"context"
	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

func (manager Manager) ExecuteV2UndeploymentPipeline(v2Pipeline V2UndeploymentPipeline, incomingCircleId string) {
	log.WithFields(log.Fields{"function": "ExecuteV2UndeploymentPipeline"}).Info("START:EXECUTE_V2_UNDEPLOYMENT_PIPELINE")
	err := manager.runV2ProxyUndeployments(v2Pipeline)
	if err != nil {
		manager.handleV2ProxyUndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}
	err = manager.runV2Undeployments(v2Pipeline)
	if err != nil {
		manager.handleV2UndeploymentError(v2Pipeline, err, incomingCircleId)
		return
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
	log.WithFields(log.Fields{"function": "ExecuteV2UndeploymentPipeline"}).Info("FINISH:EXECUTE_V2_UNDEPLOYMENT_PIPELINE")
}

func (manager Manager) runV2ProxyUndeployments(v2Pipeline V2UndeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2ProxyUndeployments"}).Info("START:RUN_V2_PROXY_UNDEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		currentProxyDeployment := map[string]interface{}{} // TODO improve this
		currentProxyDeployment["default"] = proxyDeployment
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, currentProxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION, true)
		})
	}
	log.WithFields(log.Fields{"function": "runV2ProxyUndeployments"}).Info("START:RUN_V2_PROXY_UNDEPLOYMENTS")
	return errs.Wait()
}

func (manager Manager) runV2Undeployments(v2Pipeline V2UndeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2Undeployments"}).Info("START:RUN_V2_UNDEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, undeployment := range v2Pipeline.Undeployments {
		currentUndeployment := undeployment
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, currentUndeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION, false)
		})
	}
	log.WithFields(log.Fields{"function": "runV2Undeployments"}).Info("FINISH:RUN_V2_UNDEPLOYMENTS")
	return errs.Wait()
}

func (manager Manager) handleV2ProxyUndeploymentError(v2Pipeline V2UndeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(log.Fields{"function": "handleV2ProxyUndeploymentError", "error": err.Error()}).Info("START:HANDLE_V2_PROXY_UNDEPLOYMENT_ERROR")
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
	log.WithFields(log.Fields{"function": "handleV2ProxyUndeploymentError"}).Info("FINISH:HANDLE_V2_PROXY_UNDEPLOYMENT_ERROR")
}

func (manager Manager) handleV2UndeploymentError(v2Pipeline V2UndeploymentPipeline, err error, incomingCircleId string) {
	log.WithFields(log.Fields{"function": "handleV2UndeploymentError", "error": err.Error()}).Info("START:HANDLE_V2_UNDEPLOYMENT_ERROR")
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
	log.WithFields(log.Fields{"function": "handleV2UndeploymentError"}).Info("FINISH:HANDLE_V2_UNDEPLOYMENT_ERROR")
}