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
	serviceJSONExpected := `{"apiVersion":"v1","kind":"Service","metadata":{"labels":{"app":"dragonboarding","service":"dragonboarding"},"name":"dragonboarding","namespace":null},"spec":{"ports":[{"name":"http","port":80,"targetPort":80}],"selector":{"app":"dragonboarding"},"type":"ClusterIP"}}`
	deploymentJSONExpected := `{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"labels":{"app":"dragonboarding","circleId":"dummy-circle-id","component":"darwin-content","tag":"darwin-acarditi","version":"dragonboarding"},"name":"test-1","namespace":null},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"dragonboarding","circleId":"dummy-circle-id","component":"darwin-content","tag":"darwin-acarditi","version":"darwin-acarditi"}},"template":{"metadata":{"annotations":{"sidecar.istio.io/inject":"true"},"labels":{"app":"dragonboarding","circleId":"dummy-circle-id","component":"darwin-content","tag":"darwin-acarditi","version":"darwin-acarditi"}},"spec":{"containers":[{"image":"realwavelab.azurecr.io/darwin-content:darwin-acarditi","imagePullPolicy":"Always","livenessProbe":{"failureThreshold":3,"httpGet":{"path":"/","port":80,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"name":"dragonboarding","readinessProbe":{"failureThreshold":3,"httpGet":{"path":"/","port":80,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"resources":{"limits":{"cpu":"128m","memory":"128Mi"},"requests":{"cpu":"64m","memory":"64Mi"}}}],"imagePullSecrets":[{"name":"realwavelab-registry"}]}}}}`

	helmTamplate := HelmTemplate{
		OverrideValues: map[string]string{
			"deploymentName": "test-1",
			"image.tag":      "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
			"tag":            "darwin-acarditi",
			"component":      "darwin-content",
			"circleId":       "dummy-circle-id",
		},
	}

	templateContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple-darwin.tgz"))
	valueContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple.yaml"))
	helmFake := NewHelmTemplate(helmTamplate)

	manifests, err := helmFake.GetManifests(string(templateContent), string(valueContent))
	if err != nil {
		t.Error(err)
	}

	var serviceManifest *unstructured.Unstructured
	var deploymentManifest *unstructured.Unstructured

	assert.Equal(t, len(manifests), 2, "manifests length should be length")

	_ = json.Unmarshal([]byte(serviceJSONExpected), &serviceManifest)

	assert.Equal(t, serviceManifest.Object, manifests["dragonboarding/templates/service.yaml"], "service should be equal")

	_ = json.Unmarshal([]byte(deploymentJSONExpected), &deploymentManifest)
	assert.Equal(t, deploymentManifest.Object, manifests["dragonboarding/templates/deployment.yaml"], "deployment should be equal")
}

func TestFailedLoadArchive(t *testing.T) {
	helmTemplate := HelmTemplate{
		OverrideValues: map[string]string{
			"Name":      "test-1",
			"Namespace": "default",
			"image.tag": "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
		},
	}

	templateContent := "fake file content"
	valueContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple.yaml"))
	helmFake := NewHelmTemplate(helmTemplate)

	_, err := helmFake.GetManifests(string(templateContent), string(valueContent))
	if err == nil {
		t.Error(err)
	}

	assert.Contains(t, err.Error(), "gzip: invalid header", "Should be load archive error")
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

	assert.Contains(t, err.Error(), "error unmarshaling JSON: while decoding JSON: json: cannot unmarshal string into Go value of type chartutil.Values", "Should be load value error")
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

	assert.Contains(t, err.Error(), "path cannot be empty", "Path can not be empty")
}
func TestShouldFailWhenOverrideHelmObjects(t *testing.T) {

	serviceJSONExpected := `{"apiVersion":"v1","kind":"Service","metadata":{"labels":{"app":"dragonboarding","service":"dragonboarding"},"name":"dragonboarding","namespace":null},"spec":{"ports":[{"name":"http","port":80,"targetPort":80}],"selector":{"app":"dragonboarding"},"type":"ClusterIP"}}`
	deploymentJSONExpected := `{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"labels":{"app":"dragonboarding","circleId":"dummy-circle-id","component":"darwin-content","tag":"darwin-acarditi","version":"dragonboarding"},"name":null,"namespace":null},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"dragonboarding","circleId":"dummy-circle-id","component":"darwin-content","tag":"darwin-acarditi","version":"darwin-acarditi"}},"template":{"metadata":{"annotations":{"sidecar.istio.io/inject":"true"},"labels":{"app":"dragonboarding","circleId":"dummy-circle-id","component":"darwin-content","tag":"darwin-acarditi","version":"darwin-acarditi"}},"spec":{"containers":[{"image":"realwavelab.azurecr.io/darwin-content:darwin-acarditi","imagePullPolicy":"Always","livenessProbe":{"failureThreshold":3,"httpGet":{"path":"/","port":80,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"name":"dragonboarding","readinessProbe":{"failureThreshold":3,"httpGet":{"path":"/","port":80,"scheme":"HTTP"},"initialDelaySeconds":30,"periodSeconds":20,"successThreshold":1,"timeoutSeconds":1},"resources":{"limits":{"cpu":"128m","memory":"128Mi"},"requests":{"cpu":"64m","memory":"64Mi"}}}],"imagePullSecrets":[{"name":"realwavelab-registry"}]}}}}`
	helmTemplate := HelmTemplate{
		OverrideValues: map[string]string{
			"Name":      "test-1",
			"Namespace": "default",
			"image.tag": "realwavelab.azurecr.io/darwin-content:darwin-acarditi",
			"tag":       "darwin-acarditi",
			"component": "darwin-content",
			"circleId":  "dummy-circle-id",
		},
	}

	templateContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple-darwin-overriding-helm.tgz"))
	valueContent, _ := ioutil.ReadFile(filepath.Join(".", "fake", "simple.yaml"))

	helmFake := NewHelmTemplate(helmTemplate)

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
