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
		log.WithFields(log.Fields{"function": "ExecuteV2UndeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_PROXY_UNDEPLOYMENTS")
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
		return
	}
	err = manager.runV2Undeployments(v2Pipeline)
	if err != nil {
		log.WithFields(log.Fields{"function": "ExecuteV2UndeploymentPipeline", "error": err.Error()}).Info("ERROR:RUN_V2_UNDEPLOYMENTS")
		manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, FAILED_STATUS, incomingCircleId)
		return
	}
	manager.triggerV2Callback(v2Pipeline.CallbackUrl, UNDEPLOYMENT_CALLBACK, SUCCEEDED_STATUS, incomingCircleId)
	log.WithFields(log.Fields{"function": "ExecuteV2UndeploymentPipeline"}).Info("FINISH:EXECUTE_V2_UNDEPLOYMENT_PIPELINE")
}

func (manager Manager) runV2ProxyUndeployments(v2Pipeline V2UndeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2ProxyUndeployments"}).Info("START:RUN_V2_PROXY_UNDEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, proxyDeployment := range v2Pipeline.ProxyDeployments {
		errs.Go(func() error {
			return manager.executeV2Manifests(v2Pipeline.ClusterConfig, proxyDeployment, v2Pipeline.Namespace, DEPLOY_ACTION)
		})
	}
	log.WithFields(log.Fields{"function": "runV2ProxyUndeployments"}).Info("START:RUN_V2_PROXY_UNDEPLOYMENTS")
	return errs.Wait()
}

func (manager Manager) runV2Undeployments(v2Pipeline V2UndeploymentPipeline) error {
	log.WithFields(log.Fields{"function": "runV2Undeployments"}).Info("START:RUN_V2_UNDEPLOYMENTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, undeployment := range v2Pipeline.Undeployments {
		errs.Go(func() error {
			return manager.executeV2HelmManifests(v2Pipeline.ClusterConfig, undeployment, v2Pipeline.Namespace, UNDEPLOY_ACTION)
		})
	}
	log.WithFields(log.Fields{"function": "runV2Undeployments"}).Info("FINISH:RUN_V2_UNDEPLOYMENTS")
	return errs.Wait()
}