package deployer

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"
	"strings"

	"github.com/imdario/mergo"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/helm/pkg/chartutil"
	"k8s.io/helm/pkg/engine"
	"k8s.io/helm/pkg/proto/hapi/chart"
)

func (d *Deployer) overrideVersionAndNamespaceValues(values chartutil.Values, namespace string, component *pipeline.Version) chartutil.Values {
	overrideValues := map[string]interface{}{
		"Release": map[string]interface{}{
			"Namespace": namespace,
			"Name":      component.Version,
		},
		"Values": map[string]interface{}{
			"image": map[string]interface{}{
				"tag": component.VersionURL,
			},
		},
	}

	valuesCopy := values.AsMap()
	mergo.Merge(&valuesCopy, overrideValues, mergo.WithOverride)

	return valuesCopy
}

func (d *Deployer) renderManifest(chart *chart.Chart, values chartutil.Values) (map[string]string, error) {
	templateEngine := engine.New()

	templateRender, err := templateEngine.Render(chart, values)

	if err != nil {
		return nil, err
	}

	return templateRender, nil
}

func (d *Deployer) getHelmChartAndValues(pipeline *pipeline.Pipeline, component *pipeline.Version) (*chart.Chart, chartutil.Values, error) {
	templateFileName := fmt.Sprintf("%s-darwin.tgz", pipeline.Name)
	templateValueFileName := fmt.Sprintf("%s.yaml", pipeline.Name)

	templateContent, err := d.getContentFile(templateFileName, pipeline)
	if err != nil {
		utils.CustomLog("error", "getHelmChartAndValues", err.Error())
		return nil, nil, err
	}

	templateValueContent, err := d.getContentFile(templateValueFileName, pipeline)
	if err != nil {
		utils.CustomLog("error", "getHelmChartAndValues", err.Error())
		return nil, nil, err
	}

	newChart, err := chartutil.LoadArchive(strings.NewReader(templateContent))
	if err != nil {
		utils.CustomLog("error", "getHelmChartAndValues", err.Error())
		return nil, nil, err
	}

	config := &chart.Config{
		Raw: templateValueContent,
	}

	renderedValues, err := chartutil.ToRenderValues(newChart, config, chartutil.ReleaseOptions{})
	if err != nil {
		utils.CustomLog("error", "getHelmChartAndValues", err.Error())
		return nil, nil, err
	}

	chartValuesOverrided := d.overrideVersionAndNamespaceValues(renderedValues.AsMap(), pipeline.Namespace, component)

	return newChart, chartValuesOverrided, nil

}

func (d *Deployer) encodeStringManifest(manifest string) (map[string]interface{}, error) {
	decode := scheme.Codecs.UniversalDeserializer().Decode
	obj, _, err := decode([]byte(manifest), nil, nil)
	if err != nil {
		return nil, err
	}

	if obj == nil {
		return nil, errors.New("Codec universal deserializer nil")
	}

	unstructuredObj, err := runtime.DefaultUnstructuredConverter.ToUnstructured(obj)
	if err != nil {
		log.Fatalln(err)
		return nil, err
	}

	return unstructuredObj, nil
}

func (d *Deployer) getContentFile(filename string, pipeline *pipeline.Pipeline) (string, error) {
	client := &http.Client{}
	helmRepository := pipeline.HelmRepository
	helmEndpoint := fmt.Sprintf(helmRepository+"%s/%s", pipeline.Name, filename)

	getHelmContentReq, err := http.NewRequest("GET", helmEndpoint, nil)
	if err != nil {
		return "", err
	}
	getHelmContentReq.Header.Add("Authorization", "token "+pipeline.GithubAccount.Token)

	response, err := client.Do(getHelmContentReq)
	if err != nil {
		return "", err
	}

	var responseMap map[string]interface{}
	err = json.NewDecoder(response.Body).Decode(&responseMap)
	if err != nil {
		return "", err
	}

	content := fmt.Sprintf("%s", responseMap["content"])

	contentDecoded, err := base64.StdEncoding.DecodeString(content)
	if err != nil {
		return "", err
	}

	return string(contentDecoded), nil
}
