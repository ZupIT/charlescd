package deployer

import (
	"encoding/json"
	"octopipe/pkg/connection/fake"
	"strings"
	"testing"

	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

var fakeDeploymentManifest = `{"apiVersion":"apps/v1beta2","kind":"Deployment","metadata":{"creationTimestamp":null,"labels":{"app":"darwin-deploy","version":"darwin-deploy"},"name":"darwin-deploy-01","namespace":"octopipe"},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"darwin-deploy","version":"darwin-deploy"}},"strategy":{},"template":{"metadata":{"annotations":{"sidecar.istio.io/inject":"true"},"creationTimestamp":null,"labels":{"app":"darwin-deploy","version":"darwin-deploy"}},"spec":{"containers":[{"env":[{"name":"CONSUL_HOST","value":"consul-server"},{"name":"DATABASE_HOST","value":"darwin-database.gcp.zup.com.br"},{"name":"DATABASE_PORT","value":"5432"},{"name":"DATABASE_USER","value":"darwindeploy"},{"name":"DATABASE_PASS","value":"acelera"},{"name":"DATABASE_NAME","value":"darwindeploy"},{"name":"MOOVE_URL","value":"http://darwin-application:8080"},{"name":"DARWIN_NOTIFICATION_URL","value":"http://darwin-deploy.qa.svc.cluster.local:3000/notifications"},{"name":"DARWIN_UNDEPLOYMENT_CALLBACK","value":"http://darwin-deploy.qa.svc.cluster.local:3000/notifications/undeployment"},{"name":"DARWIN_DEPLOYMENT_CALLBACK","value":"http://darwin-deploy.qa.svc.cluster.local:3000/notifications/deployment"},{"name":"SPINNAKER_URL","value":"https://darwin-spinnaker-gate.continuousplatform.com"},{"name":"SPINNAKER_GITHUB_ACCOUNT","value":"github-artifact"},{"name":"ENCRYPTION_KEY","valueFrom":{"secretKeyRef":{"key":"encryption-key","name":"deploy-aes256-key"}}}],"image":"realwavelab.azurecr.io/darwin-deploy:darwin-pluggable-cd-v-2","imagePullPolicy":"Always","livenessProbe":{"failureThreshold":3,"httpGet":{"path":"/healthcheck","port":3000,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"name":"darwin-deploy","readinessProbe":{"failureThreshold":3,"httpGet":{"path":"/healthcheck","port":3000,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"resources":{"limits":{"cpu":"1","memory":"1536Mi"},"requests":{"cpu":"128m","memory":"128Mi"}}}],"imagePullSecrets":[{"name":"realwavelab-registry"}],"serviceAccountName":"vault-auth"}}},"status":{}}`
var fakeServiceManifest = `{"apiVersion":"v1","kind":"Service","metadata":{"creationTimestamp":null,"labels":{"app":"darwin-deploy","service":"darwin-deploy"},"name":"darwin-deploy","namespace":"octopipe"},"spec":{"ports":[{"name":"http","port":3000,"targetPort":3000}],"selector":{"app":"darwin-deploy"}},"status":{"loadBalancer":{}}}`
var fakeDeploymentStatusSuccess = `{"availableReplicas":1,"conditions":[{"lastTransitionTime":"2020-03-16T20:01:32Z","lastUpdateTime":"2020-03-16T20:01:32Z","message":"Deployment has minimum availability.","reason":"MinimumReplicasAvailable","status":"True","type":"Available"},{"lastTransitionTime":"2020-03-16T20:00:28Z","lastUpdateTime":"2020-03-16T20:01:32Z","message":"ReplicaSet \"darwin-deploy-darwin-v-1-7-6-86557f7884\" has successfully progressed.","reason":"NewReplicaSetAvailable","status":"True","type":"Progressing"}],"observedGeneration":1,"readyReplicas":1,"replicas":1,"updatedReplicas":1}`
var fakeDeploymentStatusError = `{"availableReplicas":1,"conditions":[{"lastTransitionTime":"2020-03-16T20:01:32Z","lastUpdateTime":"2020-03-16T20:01:32Z","message":"Deployment has minimum availability.","reason":"MinimumReplicasAvailable","status":"True","type":"Available"},{"lastTransitionTime":"2020-03-16T20:00:28Z","lastUpdateTime":"2020-03-16T20:01:32Z","message":"ReplicaSet \"darwin-deploy-darwin-v-1-7-6-86557f7884\" has successfully progressed.","reason":"NewReplicaSetAvailable","status":"False","type":"Progressing"}],"observedGeneration":1,"readyReplicas":1,"replicas":1,"updatedReplicas":1}`

var resourceFakeSchema = schema.GroupVersionResource{
	Group:    "apps",
	Version:  "v1beta2",
	Resource: "deployments",
}

func TestWatchK8sDeployStatusSuccess(t *testing.T) {
	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeDeploymentManifest),
	}

	deployer := NewDeployer(fake.NewK8sFakeClient())

	_, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil {
		t.Fatalf(err.Error())
		return
	}

	res, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Get(unstruct.GetName(), metav1.GetOptions{})
	unstructured.SetNestedMap(res.Object, toMapStructure(fakeDeploymentStatusSuccess), "status")
	_, err = deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(res.GetNamespace()).Update(res, metav1.UpdateOptions{})

	err = deployer.watchK8sDeployStatus(resourceFakeSchema, unstruct, nil)
	if err != nil {
		t.Fatalf(err.Error())
		return
	}
}

func TestWatchK8sDeployTimeout(t *testing.T) {
	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeDeploymentManifest),
	}

	deployer := NewDeployer(fake.NewK8sFakeClient())

	_, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil {
		t.Fatalf(err.Error())
		return
	}

	res, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Get(unstruct.GetName(), metav1.GetOptions{})
	unstructured.SetNestedMap(res.Object, toMapStructure(fakeDeploymentStatusError), "status")
	_, err = deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(res.GetNamespace()).Update(res, metav1.UpdateOptions{})

	err = deployer.watchK8sDeployStatus(resourceFakeSchema, unstruct, nil)
	if err != nil && !strings.Contains(err.Error(), "Time resource verification exceeded") {
		t.Fatalf(err.Error())
		return
	}
}

func TestWatchK8sDeployNoDeploymentResource(t *testing.T) {
	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeServiceManifest),
	}

	deployer := NewDeployer(fake.NewK8sFakeClient())

	_, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil {
		t.Fatalf(err.Error())
		return
	}

	err = deployer.watchK8sDeployStatus(resourceFakeSchema, unstruct, nil)
	if err != nil {
		t.Fatalf(err.Error())
		return
	}
}

func TestWatchK8sDeployResourceNotFound(t *testing.T) {
	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeDeploymentManifest),
	}

	deployer := NewDeployer(fake.NewK8sFakeClient())
	err := deployer.watchK8sDeployStatus(resourceFakeSchema, unstruct, nil)
	if err != nil && !k8sErrors.IsNotFound(err) {
		t.Fatalf(err.Error())
		return
	}
}

func TestDeploySimpleWithResource(t *testing.T) {
	deployer := NewDeployer(fake.NewK8sFakeClient())

	err := deployer.Deploy(toMapStructure(fakeDeploymentManifest), false, &resourceFakeSchema, nil)
	if err != nil {
		t.Fatalf("fail to deploy manifest")
		return
	}
}

func TestDeploySimpleNoResource(t *testing.T) {
	deployer := NewDeployer(fake.NewK8sFakeClient())
	err := deployer.Deploy(toMapStructure(fakeDeploymentManifest), false, nil, nil)
	if err != nil {
		t.Fatalf("fail to deploy manifest")
		return
	}
}

func TestDeployWithResourceExisted(t *testing.T) {
	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeDeploymentManifest),
	}

	deployer := NewDeployer(fake.NewK8sFakeClient())

	_, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil {
		t.Fatalf("error to insert resource fort test")
		return
	}

	err = deployer.Deploy(toMapStructure(fakeDeploymentManifest), false, &resourceFakeSchema, nil)
	if err != nil {
		t.Fatalf("fail to deploy manifest")
		return
	}
}

func TestDeployWithResourceExistedForceUpdate(t *testing.T) {
	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeDeploymentManifest),
	}

	deployer := NewDeployer(fake.NewK8sFakeClient())

	_, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil {
		t.Fatalf("error to insert resource fort test")
		return
	}

	err = deployer.Deploy(toMapStructure(fakeDeploymentManifest), true, &resourceFakeSchema, nil)
	if err != nil {
		t.Fatalf("fail to deploy manifest")
		return
	}
}

func TestIsResourceOK(t *testing.T) {

}

func TestUndeployResourceFound(t *testing.T) {
	deployer := NewDeployer(fake.NewK8sFakeClient())

	unstruct := &unstructured.Unstructured{
		Object: toMapStructure(fakeDeploymentManifest),
	}

	_, err := deployer.k8sConnection.DynamicClientset.Resource(resourceFakeSchema).Namespace(unstruct.GetNamespace()).Create(unstruct, metav1.CreateOptions{})
	if err != nil {
		t.Fatalf("error to insert resource fort test")
		return
	}

	err = deployer.Undeploy(unstruct.GetName(), unstruct.GetNamespace(), nil)
	if err != nil {
		t.Fatalf(err.Error())
		return
	}
}

func TestUndeployResourceNotFound(t *testing.T) {
	deployer := NewDeployer(fake.NewK8sFakeClient())

	err := deployer.Undeploy("", "", nil)
	if err != nil {
		t.Fatalf(err.Error())
		return
	}
}

func toMapStructure(manifestString string) map[string]interface{} {
	var newMap map[string]interface{}
	_ = json.Unmarshal([]byte(manifestString), &newMap)

	return newMap
}
