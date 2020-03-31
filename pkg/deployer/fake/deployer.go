package fake

import (
	"encoding/json"
	"log"
	"octopipe/pkg/connection"
	"octopipe/pkg/connection/fake"
	"octopipe/pkg/deployer"
	"octopipe/pkg/pipeline"

	appsv1 "k8s.io/api/apps/v1beta2"
	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

type DeployerManagerFake struct {
	fakeK8sConnection *connection.K8sConnection
}

func NewDeployerManagerFake(fakeK8sConnection *connection.K8sConnection) *DeployerManagerFake {
	return &DeployerManagerFake{fakeK8sConnection}
}

func int32Ptr(i int32) *int32 { return &i }

func (deployerManager *DeployerManagerFake) GetManifestsByHelmChart(
	pipeline *pipeline.Pipeline, version *pipeline.Version,
) (map[string]interface{}, error) {
	fakeDeployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      version.Version,
			Namespace: pipeline.Namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: int32Ptr(2),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": "demo",
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": "demo",
					},
				},
				Spec: apiv1.PodSpec{
					Containers: []apiv1.Container{
						{
							Name:  "web",
							Image: version.VersionURL,
							Ports: []apiv1.ContainerPort{
								{
									Name:          "http",
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: 80,
								},
							},
						},
					},
				},
			},
		},
	}

	var genericDeployment map[string]interface{}
	fakeDeploymentBytes, err := json.Marshal(fakeDeployment)
	err = json.Unmarshal(fakeDeploymentBytes, &genericDeployment)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	manifests := map[string]interface{}{
		"deployment.yaml": genericDeployment,
	}

	return manifests, nil
}

func (deployerManager *DeployerManagerFake) Deploy(
	manifest map[string]interface{}, forceUpdate bool, resourceSchema *schema.GroupVersionResource, config *string,
) error {

	resource := schema.GroupVersionResource{
		Group:    "apps",
		Version:  "v1beta2",
		Resource: "deployments",
	}

	unstruct := unstructured.Unstructured{
		Object: manifest,
	}

	deployerManager.fakeK8sConnection.DynamicClientset.Resource(resource).Namespace(
		unstruct.GetNamespace(),
	).Create(&unstruct, metav1.CreateOptions{})

	return nil
}

func (deployerManager *DeployerManagerFake) Undeploy(name string, namespace string, config *string) error {
	deployer := deployer.NewDeployer(fake.NewK8sFakeClient())

	err := deployer.Undeploy(name, namespace, config)
	if err != nil {
		return err
	}

	return nil
}
