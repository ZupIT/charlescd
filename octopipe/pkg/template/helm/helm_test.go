package helm

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

func TestGetManifest(t *testing.T) {
	serviceJSONExpected := `{"apiVersion":"v1","kind":"Service","metadata":{"creationTimestamp":null,"labels":{"app":"dragonboarding","service":"dragonboarding"},"name":"dragonboarding","namespace":"default"},"spec":{"ports":[{"name":"http","port":80,"targetPort":80}],"selector":{"app":"dragonboarding"},"type":"ClusterIP"},"status":{"loadBalancer":{}}}`
	deploymentJSONExpected := `{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"creationTimestamp":null,"labels":{"app":"dragonboarding","version":"dragonboarding"},"name":"test-1","namespace":"default"},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"dragonboarding","version":"test-1"}},"strategy":{},"template":{"metadata":{"annotations":{"sidecar.istio.io/inject":"true"},"creationTimestamp":null,"labels":{"app":"dragonboarding","version":"test-1"}},"spec":{"containers":[{"image":"realwavelab.azurecr.io/darwin-content:darwin-acarditi","imagePullPolicy":"Always","livenessProbe":{"failureThreshold":3,"httpGet":{"path":"/","port":80,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"name":"dragonboarding","readinessProbe":{"failureThreshold":3,"httpGet":{"path":"/","port":80,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"resources":{"limits":{"cpu":"128m","memory":"128Mi"},"requests":{"cpu":"64m","memory":"64Mi"}}}],"imagePullSecrets":[{"name":"realwavelab-registry"}]}}},"status":{}}`

	helmTamplate := HelmTemplate{
		OverrideValues: map[string]string{
			"Name":      "test-1",
			"Namespace": "default",
			"image.tag": "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
		},
	}

	templateContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple-darwin.tgz"))
	valueContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple.yaml"))
	helmFake := NewHelmTemplate(helmTamplate)

	manifests, err := helmFake.GetManifests(string(templateContent), string(valueContent))
	if err != nil {
		t.Error(err)
	}

	var serviceManifest unstructured.Unstructured
	var deploymentManifest unstructured.Unstructured

	assert.Equal(t, len(manifests), 2, "manifests length should be length")

	_ = json.Unmarshal([]byte(serviceJSONExpected), &serviceManifest)
	assert.Equal(t, serviceManifest.Object, manifests["dragonboarding/templates/service.yaml"], "service should be equal")

	_ = json.Unmarshal([]byte(deploymentJSONExpected), &deploymentManifest)
	assert.Equal(t, deploymentManifest.Object, manifests["dragonboarding/templates/deployment.yaml"], "deployment should be equal")
}

func TestFailedLoadArchive(t *testing.T) {
	helmTamplate := HelmTemplate{
		OverrideValues: map[string]string{
			"Name":      "test-1",
			"Namespace": "default",
			"image.tag": "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
		},
	}

	templateContent := "fake file content"
	valueContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple.yaml"))
	helmFake := NewHelmTemplate(helmTamplate)

	_, err := helmFake.GetManifests(string(templateContent), string(valueContent))
	if err == nil {
		t.Error(err)
	}

	assert.Contains(t, err.Error(), "Error load chart archive", "Should be load archive error")
}

func TestFailedLoadChartValue(t *testing.T) {
	helmTamplate := HelmTemplate{
		OverrideValues: map[string]string{
			"Name":      "test-1",
			"Namespace": "default",
			"image.tag": "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
		},
	}

	templateContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple-darwin.tgz"))
	valueContent := "fake value yaml"
	helmFake := NewHelmTemplate(helmTamplate)

	_, err := helmFake.GetManifests(string(templateContent), string(valueContent))
	if err == nil {
		t.Error(err)
	}

	assert.Contains(t, err.Error(), "Error load chart values", "Should be load value error")
}

func TestOverrideValuesFailed(t *testing.T) {
	helmTamplate := HelmTemplate{
		OverrideValues: map[string]string{
			"Name":      "test-1",
			"Namespace": "default",
			"image.tag": "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
			"":          "",
		},
	}

	templateContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple-darwin.tgz"))
	valueContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple.yaml"))

	helmFake := NewHelmTemplate(helmTamplate)

	_, err := helmFake.GetManifests(string(templateContent), string(valueContent))
	if err == nil {
		t.Error(err)
	}

	assert.Contains(t, err.Error(), "Error override values in template", "Should be override values error")
}
