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
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	timeResourceVerification = 1
)

const (
	deploymentKind = "Deployment"
)

type Deployer struct {
	k8sConnection *connection.K8sConnection
}

type UseCases interface {
	GetManifestsByHelmChart(pipeline *pipeline.Pipeline, version *pipeline.Version) (map[string]interface{}, error)
	Deploy(
		manifest map[string]interface{}, forceUpdate bool, resourceSchema *schema.GroupVersionResource, config *string,
	) error
	Undeploy(name string, namespace string, config *string) error
}

func NewDeployer(k8sConnection *connection.K8sConnection) *Deployer {
	return &Deployer{k8sConnection}
}

func (deployer *Deployer) GetManifestsByHelmChart(pipeline *pipeline.Pipeline, version *pipeline.Version) (map[string]interface{}, error) {
	encodedManifests := map[string]interface{}{}
	chart, values, err := deployer.getHelmChartAndValues(pipeline, version)
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

func (deployer *Deployer) Deploy(
	manifest map[string]interface{}, forceUpdate bool, resourceSchema *schema.GroupVersionResource, config *string,
) error {
	var err error

	clientset, err := deployer.getK8sClientByKubeconfig(config)
	if err != nil {
		return err
	}

	unstruct := &unstructured.Unstructured{
		Object: manifest,
	}
	var schema schema.GroupVersionResource
	if resourceSchema != nil {
		schema = *resourceSchema
	} else {
		schema = *deployer.getResourceSchema(unstruct)
	}

	_, err = clientset.Resource(schema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil && k8sErrors.IsAlreadyExists(err) {
		if forceUpdate {
			var res *unstructured.Unstructured
			res, err = clientset.Resource(schema).Namespace(unstruct.GetNamespace()).Get(unstruct.GetName(), metav1.GetOptions{})
			mergo.Merge(&res.Object, unstruct.Object, mergo.WithOverride)
			_, err = clientset.Resource(schema).Namespace(unstruct.GetNamespace()).Update(res, metav1.UpdateOptions{})
		} else {
			utils.CustomLog("info", "Deploy", err.Error())
			return nil
		}
	}

	if err != nil {
		utils.CustomLog("error", "Deploy", err.Error())
		return err
	}

	err = deployer.watchK8sDeployStatus(schema, unstruct, config)
	if err != nil {
		utils.CustomLog("error", "Deploy", err.Error())
		return err
	}

	return nil
}

func (deployer *Deployer) Undeploy(name string, namespace string, config *string) error {

	deploymentResource := schema.GroupVersionResource{
		Group:    "apps",
		Version:  "v1beta2",
		Resource: "deployments",
	}

	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := &metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}

	clientset, err := deployer.getK8sClientByKubeconfig(config)
	if err != nil {
		return err
	}

	err = clientset.Resource(deploymentResource).Namespace(namespace).Delete(name, deleteOptions)
	if err != nil && strings.Contains(err.Error(), "not found") {
		utils.CustomLog("info", "Undeploy", err.Error())
		return nil
	}

	if err != nil {
		utils.CustomLog("error", "Undeploy", err.Error())
		return err
	}

	return nil
}

func (deployer *Deployer) watchK8sDeployStatus(
	schema schema.GroupVersionResource, resource *unstructured.Unstructured, config *string,
) error {
	timeoutDone := make(chan bool)

	clientset, err := deployer.getK8sClientByKubeconfig(config)
	if err != nil {
		return err
	}

	res, err := clientset.Resource(schema).Namespace(resource.GetNamespace()).Get(resource.GetName(), metav1.GetOptions{})
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

func (deployer *Deployer) getK8sClientByKubeconfig(config *string) (dynamic.Interface, error) {
	if config != nil {
		config, err := clientcmd.RESTConfigFromKubeConfig([]byte(*config))
		if err != nil {
			return nil, err
		}

		return dynamic.NewForConfig(config)
	}

	return deployer.k8sConnection.DynamicClientset, nil
}
