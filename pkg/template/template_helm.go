package template

import (
	"encoding/json"
	"errors"
	"octopipe/pkg/utils"
	"strings"

	"github.com/tidwall/sjson"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/helm/pkg/chartutil"
	"k8s.io/helm/pkg/engine"
	"k8s.io/helm/pkg/proto/hapi/chart"
)

type HelmTemplate struct {
}

func NewHelmTemplate() *HelmTemplate {
	return &HelmTemplate{}
}

func (helmTemplate *HelmTemplate) GetManifests(templateContent, valueContent string, overrideValues map[string]string) (map[string]interface{}, error) {
	chartTemplate, chartValues, err := helmTemplate.getHelmChartAndValues(templateContent, valueContent, overrideValues)
	if err != nil {
		return nil, err
	}

	manifests, err := helmTemplate.renderManifest(chartTemplate, chartValues)
	if err != nil {
		return nil, err
	}

	encodedManifests, err := helmTemplate.encodeManifests(manifests)
	if err != nil {
		return nil, err
	}

	return encodedManifests, nil
}

func (helmTemplate *HelmTemplate) renderManifest(chart *chart.Chart, values chartutil.Values) (map[string]string, error) {
	templateEngine := engine.New()

	templateRender, err := templateEngine.Render(chart, values)

	if err != nil {
		return nil, err
	}

	return templateRender, nil
}

func (helmTemplate *HelmTemplate) getHelmChartAndValues(templateContent, valueContent string, overrideValues map[string]string) (*chart.Chart, chartutil.Values, error) {
	newChart, err := chartutil.LoadArchive(strings.NewReader(templateContent))
	if err != nil {
		utils.CustomLog("error", "getHelmChartAndValues", err.Error())
		return nil, nil, err
	}

	config := &chart.Config{
		Raw: valueContent,
	}

	renderedValues, err := chartutil.ToRenderValues(newChart, config, chartutil.ReleaseOptions{})
	if err != nil {
		utils.CustomLog("error", "getHelmChartAndValues", err.Error())
		return nil, nil, err
	}

	overridedValues, err := helmTemplate.overrideValues(renderedValues.AsMap(), overrideValues)
	if err != nil {
		return nil, nil, err
	}

	return newChart, overridedValues, nil

}

func (helmTemplate *HelmTemplate) overrideValues(
	chartValues map[string]interface{}, overrideValues map[string]string,
) (map[string]interface{}, error) {
	overridedManifests := map[string]interface{}{}

	for manifestKey, manifest := range chartValues {
		manifestBytes, _ := json.Marshal(manifest)
		for keyPath, value := range overrideValues {
			manifestStringOverrided, err := sjson.Set(string(manifestBytes), keyPath, value)
			if err != nil {
				return nil, err
			}

			manifestBytes = []byte(manifestStringOverrided)
		}

		var newManifest map[string]interface{}
		err := json.Unmarshal([]byte(manifestBytes), &newManifest)
		if err != nil {
			return nil, err
		}

		overridedManifests[manifestKey] = newManifest
	}

	return overridedManifests, nil
}

func (helmTemplate *HelmTemplate) encodeManifests(manifests map[string]string) (map[string]interface{}, error) {
	encodedManifests := map[string]interface{}{}

	for key, manifest := range manifests {
		if manifest == "" {
			continue
		}

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
			return nil, err
		}

		encodedManifests[key] = unstructuredObj
	}

	return encodedManifests, nil
}
