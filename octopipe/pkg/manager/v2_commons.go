package manager

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/customerror"
	"strings"

	"github.com/sirupsen/logrus"
	"istio.io/api/networking/v1alpha3"
	"k8s.io/klog"

	"golang.org/x/sync/errgroup"
)

func (manager Manager) executeV2Manifests(
	clusterConfig cloudprovider.Cloudprovider,
	manifests map[string]interface{},
	namespace string,
	action string,
) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, manifest := range manifests {
		currentManifest := manifest
		errs.Go(func() error {
			return manager.applyV2Manifest(clusterConfig, currentManifest.(map[string]interface{}), namespace, action)
		})
	}
	return errs.Wait()
}

func (manager Manager) applyV2Manifest(
	clusterConfig cloudprovider.Cloudprovider,
	manifest map[string]interface{},
	namespace string,
	action string,
) error {
	cloudprovider := manager.cloudproviderMain.NewCloudProvider(clusterConfig)
	config, err := cloudprovider.GetClient()
	if err != nil {
		return err
	}

	deployment := manager.deploymentMain.NewDeployment(action, false, namespace, manifest, config, manager.kubectl)
	err = deployment.Do()
	if err != nil {
		return err
	}
	return nil
}

func (manager Manager) executeV2HelmManifests(
	clusterConfig cloudprovider.Cloudprovider,
	manifests map[string]interface{},
	namespace string,
	action string,
) error {
	err := manager.executeV2Manifests(clusterConfig, manifests, namespace, action)
	if err != nil {
		return err
	}
	return nil
}

func (manager Manager) getV2HelmManifests(deployment V2Deployment, extraValues string) (map[string]interface{}, error) {
	manifests, err := manager.getManifestsbyV2Template(deployment, extraValues)
	if err != nil {
		return nil, err
	}

	if len(manifests) <= 0 {
		return nil, errors.New("Not manifests found for execution")
	}

	return manifests, nil
}

func (manager Manager) getManifestsbyV2Template(deployment V2Deployment, extraValues string) (map[string]interface{}, error) {
	templateContent, valueContent, err := manager.getFilesFromV2Repository(deployment)
	var builderString strings.Builder
	builderString.WriteString(valueContent)
	builderString.WriteString("\n")
	builderString.WriteString(extraValues)
	valueMerged := builderString.String()
	// klog.Info(valueContent)
	if err != nil {
		return nil, err
	}
	manifests, err := deployment.HelmConfig.GetManifests(templateContent, valueMerged)
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
	klog.Info(fmt.Sprintf("TRIGGER CALLBACK - STATUS: %s - URL: %s", status, callbackUrl))
	client := http.Client{}
	callbackData := V2CallbackData{callbackType, status}
	request, err := manager.mountV2WebhookRequest(callbackUrl, callbackData, incomingCircleId)
	if err != nil {
		logrus.WithFields(customerror.WithLogFields(customerror.New("Mount webhook request", err.Error(), map[string]string{
			"url":          callbackUrl,
			"status":       status,
			"callbackType": callbackType,
		}))).Error()
		return
	}
	_, err = client.Do(request)
	if err != nil {
		logrus.WithFields(customerror.WithLogFields(customerror.New("Request error", err.Error(), map[string]string{
			"url":          callbackUrl,
			"status":       status,
			"callbackType": callbackType,
		}))).Error()
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
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("x-circle-id", incomingCircleId)
	return request, nil
}

func (manager Manager) removeDataFromProxyDeployments(proxyDeployments []map[string]interface{}) (map[string]VirtualServiceData, error) {
	virtualServiceData := map[string]VirtualServiceData{}
	for _, proxyDeployment := range proxyDeployments {
		metadata := proxyDeployment["metadata"].(map[string]interface{})
		componentName := metadata["name"].(string)
		trafficCircles := []string{}
		defaultCircle := DefaultCircle{}
		unmarshalProxy, err := json.Marshal(proxyDeployment["spec"])

		if err != nil {
			return nil, err
		}

		if proxyDeployment["kind"] == "DestinationRule" {
			destinationRule := v1alpha3.DestinationRule{}
			err := json.Unmarshal(unmarshalProxy, &destinationRule)
			if err != nil {
				return nil, err
			}
			// In the future destination rules spec will be check
		} else {
			virtualService := v1alpha3.VirtualService{}
			err := json.Unmarshal(unmarshalProxy, &virtualService)
			if err != nil {
				return nil, err
			}
			for _, httpEntry := range virtualService.Http {
				if httpEntry.Match != nil && httpEntry.Match[0].Headers["x-circle-id"] != nil {
					trafficCircles = append(trafficCircles, httpEntry.Route[0].Destination.Subset)
				} else if httpEntry.Match == nil {
					defaultCircle.Enabled = true
					defaultCircle.CircleID = httpEntry.Route[0].Destination.Subset
				}
			}
		}
		virtualServiceData[componentName] = VirtualServiceData{
			Traffic:       trafficCircles,
			DefaultCircle: defaultCircle,
		}
	}
	return virtualServiceData, nil
}

func (manager Manager) removeVirtualServiceManifest(mapManifests map[string]interface{}) (map[string]interface{}, map[string]interface{}) {
	mapVirtualServices := map[string]interface{}{}
	mapHelmManifests := map[string]interface{}{}
	for key, manifests := range mapManifests {
		tmpManifests := map[string]interface{}{}
		tmpVirtualService := map[string]interface{}{}
		for key, manifest := range manifests.(map[string]interface{}) {
			manifest := manifest.(map[string]interface{})
			if manifest["kind"] == "VirtualService" {
				tmpVirtualService[key] = manifest
			} else {
				tmpManifests[key] = manifest
			}
		}
		mapHelmManifests[key] = tmpManifests
		mapVirtualServices[key] = tmpVirtualService
	}
	return mapVirtualServices, mapHelmManifests
}
