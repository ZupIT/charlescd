package manager

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"golang.org/x/sync/errgroup"
	"net/http"
	"octopipe/pkg/cloudprovider"
)

func (manager Manager) executeV2Manifests(clusterConfig cloudprovider.Cloudprovider, manifests map[string]interface{}, namespace string, action string) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, manifest := range manifests {
		currentManifest := manifest
		errs.Go(func() error {
			return manager.applyV2Manifest(clusterConfig, currentManifest.(map[string]interface{}), namespace, action)
		})
	}
	return errs.Wait()
}

func (manager Manager) applyV2Manifest(clusterConfig cloudprovider.Cloudprovider, manifest map[string]interface{}, namespace string, action string) error {
	cloudprovider := manager.cloudproviderMain.NewCloudProvider(clusterConfig)
	config, err := cloudprovider.GetClient()
	if err != nil {
		return err
	}

	deployment := manager.deploymentMain.NewDeployment(action, false, namespace, manifest, config)
	err = deployment.Do()
	if err != nil {
		return err
	}
	return nil
}

func (manager Manager) executeV2HelmManifests(clusterConfig cloudprovider.Cloudprovider, deployment V2Deployment, namespace string, action string) error {
	manifests, err := manager.getV2HelmManifests(deployment)
	if err != nil {
		return err
	}
	err = manager.executeV2Manifests(clusterConfig, manifests, namespace, action)
	if err != nil {
		return err
	}
	return nil
}

func (manager Manager) getV2HelmManifests(deployment V2Deployment) (map[string]interface{}, error) {
	manifests := map[string]interface{}{}
	manifests, err := manager.getManifestsbyV2Template(deployment)
	if err != nil {
		return nil, err
	}

	if len(manifests) <= 0 {
		return nil, errors.New("Not found manifests for execution")
	}

	return manifests, nil
}

func (manager Manager) getManifestsbyV2Template(deployment V2Deployment) (map[string]interface{}, error) {
	templateContent, valueContent, err := manager.getFilesFromV2Repository(deployment)
	if err != nil {
		return nil, err
	}
	manifests, err := deployment.HelmConfig.GetManifests(templateContent, valueContent)
	if err != nil {
		return nil, err
	}
	return manifests, nil
}

func (manager Manager) getFilesFromV2Repository(deployment V2Deployment) (string, string, error) {
	repository, err := manager.repositoryMain.NewRepository(deployment.HelmRepositoryConfig)
	if err != nil {
		return "", "", err
	}
	templateContent, valueContent, err := repository.GetTemplateAndValueByName(deployment.ComponentName)
	if err != nil {
		return "", "", err
	}
	return templateContent, valueContent, nil
}

func (manager Manager) triggerV2Callback(callbackUrl string, callbackType string, status string, incomingCircleId string) {
	client := http.Client{}
	callbackData := V2CallbackData{callbackType, status }
	request, err := manager.mountV2WebhookRequest(callbackUrl, callbackData, incomingCircleId)
	if err != nil {
		return
	}
	_, err = client.Do(request)
	if err != nil {
		return
	}
}

func (manager Manager) mountV2WebhookRequest(callbackUrl string, payload V2CallbackData, incomingCircleId string) (*http.Request, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	request, err := http.NewRequest("POST", callbackUrl, bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	request.Header.Set("x-circle-id", incomingCircleId)
	return request, nil
}