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

package helm

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"strings"

	"github.com/tidwall/sjson"

	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/chartutil"
	"helm.sh/helm/v3/pkg/engine"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/scheme"

	log "github.com/sirupsen/logrus"
)

type HelmTemplate struct {
	OverrideValues map[string]string `json:"overrideValues"`
}

func NewHelmTemplate(template HelmTemplate) HelmTemplate {
	return template
}

func (helmTemplate HelmTemplate) GetManifests(templateContent, valueContent string) (map[string]interface{}, error) {
	ioutil.WriteFile("./pkg/template/helm/dat", []byte(templateContent), 0644)

	chartTemplate, chartValues, err := helmTemplate.getHelmChartAndValues(templateContent, valueContent, helmTemplate.OverrideValues)
	if err != nil {

		return nil, err
	}

	manifests, err := helmTemplate.renderManifest(chartTemplate, chartValues)
	if err != nil {
		log.WithFields(log.Fields{"function": "GetManifests"}).Error("It was not possible to render the manifest using helm template. Error: " + err.Error())
		return nil, err
	}

	encodedManifests, err := helmTemplate.encodeManifests(manifests)
	if err != nil {
		log.WithFields(log.Fields{"function": "GetManifests"}).Error("It was not possible to transform the manifest into a valid json. Error: " + err.Error())
		return nil, err
	}

	return encodedManifests, nil
}

func (helmTemplate HelmTemplate) renderManifest(chart chart.Chart, values chartutil.Values) (map[string]string, error) {
	templateRender, err := engine.Render(&chart, values)

	if err != nil {
		return nil, err
	}

	return templateRender, nil
}

func (helmTemplate HelmTemplate) getHelmChartAndValues(templateContent, valueContent string, overrideValues map[string]string) (chart.Chart, chartutil.Values, error) {

	newChart, err := loader.LoadArchive(strings.NewReader(templateContent))
	if err != nil {
		return chart.Chart{}, nil, errors.New("Error load chart archive. Error: " + err.Error())
	}

	values, err := chartutil.ReadValues([]byte(valueContent))
	if err != nil {
		return chart.Chart{}, nil, errors.New("Error load chart values. Error: " + err.Error())
	}

	renderedValues, err := chartutil.ToRenderValues(newChart, values.AsMap(), chartutil.ReleaseOptions{}, nil)
	if err != nil {
		return chart.Chart{}, nil, err
	}

	overridedValues, err := helmTemplate.overrideValues(renderedValues.AsMap(), overrideValues)
	if err != nil {
		return chart.Chart{}, nil, errors.New("Error override values in template. Error: " + err.Error())
	}

	return *newChart, overridedValues, nil

}

func (helmTemplate HelmTemplate) overrideValues(
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

func (helmTemplate HelmTemplate) chartValueBytesToStructure(chartValueBytes []byte) (map[string]interface{}, error) {
	var newChartValue map[string]interface{}
	err := json.Unmarshal(chartValueBytes, &newChartValue)
	if err != nil {
		return nil, err
	}

	return newChartValue, nil
}

func (helmTemplate HelmTemplate) overrideValueInChartValueBytes(
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

func (helmTemplate HelmTemplate) encodeManifests(manifests map[string]string) (map[string]interface{}, error) {
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
