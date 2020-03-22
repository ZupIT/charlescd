package deployer

import (
	"errors"
	"fmt"
	"octopipe/pkg/connection"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/imdario/mergo"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

const (
	timeResourceVerification = 1
)

type Deployer struct {
	k8sConnection *connection.K8sConnection
}

type UseCases interface {
	GetManifestsByHelmChart(pipeline *pipeline.Pipeline, component *pipeline.Version) (map[string]interface{}, error)
	Deploy(manifest map[string]interface{}, forceUpdate bool, resourceSchema *schema.GroupVersionResource) error
	Undeploy(manifest map[string]interface{}) error
}

func NewDeployer(k8sConnection *connection.K8sConnection) *Deployer {
	return &Deployer{k8sConnection}
}

func (deployer *Deployer) GetManifestsByHelmChart(pipeline *pipeline.Pipeline, component *pipeline.Version) (map[string]interface{}, error) {
	encodedManifests := map[string]interface{}{}
	chart, values, err := deployer.getHelmChartAndValues(pipeline, component)
	if err != nil {
		return nil, err
	}

	manifests, err := deployer.renderManifest(chart, values)
	if err != nil {
		return nil, err
	}

	for key, manifest := range manifests {
		if manifest != "" {
			encodedManifest, err := deployer.encodeStringManifest(manifest)
			if err != nil {
				return nil, err
			}
			encodedManifests[key] = encodedManifest
		}
	}

	return encodedManifests, nil
}

func (deployer *Deployer) Deploy(manifest map[string]interface{}, forceUpdate bool, resourceSchema *schema.GroupVersionResource) error {
	var err error

	unstruct := &unstructured.Unstructured{
		Object: manifest,
	}
	var schema schema.GroupVersionResource
	if resourceSchema != nil {
		schema = *resourceSchema
	} else {
		schema = *deployer.getResourceSchema(unstruct)
	}

	_, err = deployer.k8sConnection.DynamicClientset.Resource(schema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil && k8sErrors.IsAlreadyExists(err) {
		if forceUpdate {
			var res *unstructured.Unstructured
			res, err = deployer.k8sConnection.DynamicClientset.Resource(schema).Namespace(unstruct.GetNamespace()).Get(unstruct.GetName(), metav1.GetOptions{})
			mergo.Merge(&res.Object, unstruct.Object, mergo.WithOverride)
			_, err = deployer.k8sConnection.DynamicClientset.Resource(schema).Namespace(unstruct.GetNamespace()).Update(res, metav1.UpdateOptions{})
		} else {
			utils.CustomLog("info", "Deploy", err.Error())
			return nil
		}
	}

	err = deployer.watchK8sDeployStatus(schema, unstruct)
	if err != nil {
		utils.CustomLog("error", "Deploy", err.Error())
		return err
	}

	return nil
}

func (deployer *Deployer) Undeploy(manifest map[string]interface{}) error {

	unstruct := &unstructured.Unstructured{
		Object: manifest,
	}
	schema := *deployer.getResourceSchema(unstruct)

	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := &metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}
	err := deployer.k8sConnection.DynamicClientset.Resource(schema).Namespace(unstruct.GetNamespace()).Delete(unstruct.GetName(), deleteOptions)
	if err != nil && k8sErrors.IsNotFound(err) {
		utils.CustomLog("info", "Undeploy", err.Error())
		return nil
	}

	if err != nil {
		utils.CustomLog("error", "Undeploy", err.Error())
		return err
	}

	return nil
}

func (deployer *Deployer) watchK8sDeployStatus(schema schema.GroupVersionResource, resource *unstructured.Unstructured) error {
	timeoutDone := make(chan bool)
	res, err := deployer.k8sConnection.DynamicClientset.Resource(schema).Namespace(resource.GetNamespace()).Get(resource.GetName(), metav1.GetOptions{})
	if err != nil {
		utils.CustomLog("error", "watchK8sDeployStatus", err.Error())
		return err
	}

	conditions, found, err := unstructured.NestedSlice(res.Object, "status", "conditions")
	if err != nil {
		utils.CustomLog("error", "watchK8sDeployStatus", err.Error())
		return err
	}

	if found {
		for {
			time.Sleep(timeResourceVerification * time.Second)
			select {
			case <-timeoutDone:
				err = errors.New("Time resource verification exceeded")
				return err
			default:
				utils.CustomLog("info", "isResourceOk", "Resource verification")
				ok := deployer.isResourceOk(conditions)
				if ok {
					return nil
				} else {
					go func() {
						second, _ := strconv.ParseInt(os.Getenv("TIMEOUT_RESOURCE_VERIFICATION"), 10, 64)
						time.Sleep(time.Duration(second) * time.Second)
						timeoutDone <- true
					}()
				}
			}
		}
	}

	if err != nil {
		utils.CustomLog("error", "watchK8sDeployStatus", err.Error())
		return nil
	}

	return nil
}

func (deployer *Deployer) isResourceOk(conditions []interface{}) bool {
	failedStatus := []interface{}{}

	for _, condition := range conditions {
		status, _, _ := unstructured.NestedString(condition.(map[string]interface{}), "status")
		if status == "False" {
			failedStatus = append(failedStatus, condition)
		}
	}

	if len(failedStatus) <= 0 {
		return true
	}

	return false
}

func (deployer *Deployer) getResourceSchema(k8sObject *unstructured.Unstructured) *schema.GroupVersionResource {
	group := k8sObject.GroupVersionKind().Group
	version := k8sObject.GroupVersionKind().Version
	resource := fmt.Sprintf("%ss", strings.ToLower(k8sObject.GroupVersionKind().Kind))
	return &schema.GroupVersionResource{Group: group, Version: version, Resource: resource}
}
