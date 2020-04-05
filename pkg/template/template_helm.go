package template

import (
	"errors"
	"octopipe/pkg/utils"
	"strings"

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

func (helmTemplate *HelmTemplate) GetManifests(templateContent, valueContent string) (map[string]interface{}, error) {
	chartTemplate, chartValues, err := helmTemplate.getHelmChartAndValues(templateContent, valueContent)
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

func (helmTemplate *HelmTemplate) getHelmChartAndValues(templateContent, valueContent string) (*chart.Chart, chartutil.Values, error) {
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

	return newChart, renderedValues, nil

}

func (helmTemplate *HelmTemplate) overrideManifestsValues(values chartutil.Values) chartutil.Values {
	return values
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
