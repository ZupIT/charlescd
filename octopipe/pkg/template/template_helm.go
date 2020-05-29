/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
	overridedChartValues := map[string]interface{}{}

	for chartValueKey, chartValue := range chartValues {
		chartValueBytes, _ := json.Marshal(chartValue)

		newChartValueBytes, err := helmTemplate.overrideValueInChartValueBytes(chartValueBytes, overrideValues)
		if err != nil {
			return nil, err
		}

		newChartValue, err := helmTemplate.chartValueBytesToStructure(newChartValueBytes)
		if err != nil {
			return nil, err
		}
		overridedChartValues[chartValueKey] = newChartValue
	}

	return overridedChartValues, nil
}

func (helmTemplate *HelmTemplate) chartValueBytesToStructure(chartValueBytes []byte) (map[string]interface{}, error) {
	var newChartValue map[string]interface{}
	err := json.Unmarshal(chartValueBytes, &newChartValue)
	if err != nil {
		return nil, err
	}

	return newChartValue, nil
}

func (helmTemplate *HelmTemplate) overrideValueInChartValueBytes(
	chartValueBytes []byte, overrideValues map[string]string,
) ([]byte, error) {
	newChartValueBytes := chartValueBytes

	for keyPath, value := range overrideValues {
		manifestStringOverrided, err := sjson.Set(string(newChartValueBytes), keyPath, value)
		if err != nil {
			return nil, err
		}

		newChartValueBytes = []byte(manifestStringOverrided)
	}

	return newChartValueBytes, nil
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
