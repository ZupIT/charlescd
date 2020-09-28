package manager

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
	"net/http"
	"octopipe/pkg/cloudprovider"
)

func (manager Manager) executeV2Manifests(
	clusterConfig cloudprovider.Cloudprovider,
	manifests map[string]interface{},
	namespace string,
	action string,
) error {
	log.WithFields(log.Fields{"function": "executeV2Manifests"}).Info("START:EXECUTE_V2_MANIFESTS")
	errs, _ := errgroup.WithContext(context.Background())
	for _, manifest := range manifests {
		currentManifest := manifest
		errs.Go(func() error {
			return manager.applyV2Manifest(clusterConfig, currentManifest.(map[string]interface{}), namespace, action)
		})
	}
	log.WithFields(log.Fields{"function": "executeV2Manifests"}).Info("FINISH:EXECUTE_V2_MANIFESTS")
	return errs.Wait()
}

func (manager Manager) applyV2Manifest(
	clusterConfig cloudprovider.Cloudprovider,
	manifest map[string]interface{},
	namespace string,
	action string,
) error {
	log.WithFields(log.Fields{"function": "applyV2Manifest"}).Info("START:APPLY_V2_MANIFEST")
	cloudprovider := manager.cloudproviderMain.NewCloudProvider(clusterConfig)
	config, err := cloudprovider.GetClient()
	if err != nil {
		log.WithFields(log.Fields{"function": "applyV2Manifest", "error": err.Error()}).Info("ERROR:GET_CLOUD_PROVIDER")
		return err
	}

	deployment := manager.deploymentMain.NewDeployment(action, false, namespace, manifest, config)
	err = deployment.Do()
	if err != nil {
		log.WithFields(log.Fields{"function": "applyV2Manifest", "error": err.Error()}).Info("ERROR:DO_DEPLOYMENT")
		return err
	}
	log.WithFields(log.Fields{"function": "applyV2Manifest"}).Info("FINISH:APPLY_V2_MANIFEST")
	return nil
}

func (manager Manager) executeV2HelmManifests(
	clusterConfig cloudprovider.Cloudprovider,
	deployment V2Deployment,
	namespace string,
	action string,
	forceUpdate bool,
) error {
	log.WithFields(log.Fields{"function": "executeV2HelmManifests"}).Info("START:EXECUTE_V2_HELM_MANIFESTS")
	manifests, err := manager.getV2HelmManifests(deployment)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeV2HelmManifests", "error": err.Error()}).Info("ERROR:GET_V2_HELM_MANIFESTS")
		return err
	}
	err = manager.executeV2Manifests(clusterConfig, manifests, namespace, action)
	if err != nil {
		log.WithFields(log.Fields{"function": "executeV2HelmManifests", "error": err.Error()}).Info("ERROR:EXECUTE_V2_MANIFESTS")
		return err
	}
	log.WithFields(log.Fields{"function": "executeV2HelmManifests"}).Info("START:EXECUTE_V2_HELM_MANIFESTS")
	return nil
}

func (manager Manager) getV2HelmManifests(deployment V2Deployment) (map[string]interface{}, error) {
	log.WithFields(log.Fields{"function": "getV2HelmManifests"}).Info("START:GET_V2_HELM_MANIFESTS")
	manifests := map[string]interface{}{}
	manifests, err := manager.getManifestsbyV2Template(deployment)
	if err != nil {
		log.WithFields(log.Fields{"function": "getV2HelmManifests", "error": err.Error()}).Info("ERROR:GET_MANIFESTS_BY_V2_TEMPLATE")
		return nil, err
	}

	if len(manifests) <= 0 {
		log.WithFields(log.Fields{"function": "getV2HelmManifests"}).Info("ERROR:NO_MANIFESTS_FOUND")
		return nil, errors.New("Not manifests found for execution")
	}

	log.WithFields(log.Fields{"function": "getV2HelmManifests"}).Info("FINISH:GET_V2_HELM_MANIFESTS")
	return manifests, nil
}

func (manager Manager) getManifestsbyV2Template(deployment V2Deployment) (map[string]interface{}, error) {
	log.WithFields(log.Fields{"function": "getManifestsbyV2Template"}).Info("START:GET_MANIFESTS_BY_V2_TEMPLATE")
	templateContent, valueContent, err := manager.getFilesFromV2Repository(deployment)
	if err != nil {
		log.WithFields(log.Fields{"function": "getManifestsbyV2Template", "error": err.Error()}).Info("ERROR:GET_FILES_FROM_V2_REPOSITORY")
		return nil, err
	}
	manifests, err := deployment.HelmConfig.GetManifests(templateContent, valueContent)
	if err != nil {
		log.WithFields(log.Fields{"function": "getManifestsbyV2Template", "error": err.Error()}).Info("ERROR:GET_MANIFESTS")
		return nil, err
	}
	log.WithFields(log.Fields{"function": "getManifestsbyV2Template"}).Info("FINISH:GET_MANIFESTS_BY_V2_TEMPLATE")
	return manifests, nil
}

func (manager Manager) getFilesFromV2Repository(deployment V2Deployment) (string, string, error) {
	log.WithFields(log.Fields{"function": "getFilesFromV2Repository"}).Info("START:GET_FILES_FROM_V2_REPOSITORY")
	repository, err := manager.repositoryMain.NewRepository(deployment.HelmRepositoryConfig)
	if err != nil {
		log.WithFields(log.Fields{"function": "getFilesFromV2Repository", "error": err.Error()}).Info("ERROR:CREATE_REPOSITORY")
		return "", "", err
	}
	templateContent, valueContent, err := repository.GetTemplateAndValueByName(deployment.ComponentName)
	if err != nil {
		log.WithFields(log.Fields{"function": "getFilesFromV2Repository", "error": err.Error()}).Info("ERROR:GET_TEMPLATE_AND_VALUE_BY_NAME")
		return "", "", err
	}
	log.WithFields(log.Fields{"function": "getFilesFromV2Repository"}).Info("FINISH:GET_FILES_FROM_V2_REPOSITORY")
	return templateContent, valueContent, nil
}

func (manager Manager) triggerV2Callback(callbackUrl string, callbackType string, status string, incomingCircleId string) {
	log.WithFields(
		log.Fields{"function": "triggerV2Callback", "callbackUrl": callbackUrl, "status": status, "type": callbackType, "incomingCircleId": incomingCircleId},
	).Info("START:TRIGGER_V2_CALLBACK")
	client := http.Client{}
	callbackData := V2CallbackData{callbackType, status }
	request, err := manager.mountV2WebhookRequest(callbackUrl, callbackData, incomingCircleId)
	if err != nil {
		log.WithFields(log.Fields{"function": "triggerV2Callback", "error": err.Error()}).Info("ERROR:MOUNT_V2_WEBHOOK_REQUEST")
		return
	}
	_, err = client.Do(request)
	if err != nil {
		log.WithFields(log.Fields{"function": "triggerV2Callback", "error": err.Error()}).Info("ERROR:DO_REQUEST")
		return
	}
	log.WithFields(log.Fields{"function": "triggerV2Callback"}).Info("FINISH:TRIGGER_V2_CALLBACK")
}

func (manager Manager) mountV2WebhookRequest(callbackUrl string, payload V2CallbackData, incomingCircleId string) (*http.Request, error) {
	log.WithFields(log.Fields{"function": "mountV2WebhookRequest"}).Info("START:MOUNT_V2_WEBHOOK_REQUEST")
	data, err := json.Marshal(payload)
	if err != nil {
		log.WithFields(log.Fields{"function": "mountV2WebhookRequest", "error": err.Error()}).Info("ERROR:JSON_MARSHAL")
		return nil, err
	}
	request, err := http.NewRequest("POST", callbackUrl, bytes.NewBuffer(data))
	if err != nil {
		log.WithFields(log.Fields{"function": "mountV2WebhookRequest", "error": err.Error()}).Info("ERROR:CREATE_REQUEST_OBJECT")
		return nil, err
	}
	request.Header.Set("x-circle-id", incomingCircleId)
	log.WithFields(log.Fields{"function": "mountV2WebhookRequest"}).Info("FINISH:MOUNT_V2_WEBHOOK_REQUEST")
	return request, nil
}