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
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"strings"

	"github.com/tidwall/sjson"

	log "github.com/sirupsen/logrus"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/chartutil"
	"helm.sh/helm/v3/pkg/engine"
	"k8s.io/apimachinery/pkg/runtime"
	kubeyaml "k8s.io/apimachinery/pkg/util/yaml"
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

	renderedHelmObjects, err := chartutil.ToRenderValues(newChart, values.AsMap(), chartutil.ReleaseOptions{}, nil)
	if err != nil {
		return chart.Chart{}, nil, err
	}

	renderedValues, err := helmTemplate.getValuesHelmObject(renderedHelmObjects)
	if err != nil {
		return chart.Chart{}, nil, errors.New("Error overriding values in template. Error: " + err.Error())
	}

	overridedValues, err := helmTemplate.overrideValues(renderedValues, overrideValues)
	if err != nil {
		return chart.Chart{}, nil, errors.New("Error overriding values in template. Error: " + err.Error())
	}

	renderedHelmObjects["Values"] = overridedValues

	return *newChart, renderedHelmObjects, nil

}

func (helmTemplate HelmTemplate) getValuesHelmObject(renderedHelmObjects chartutil.Values) (map[string]interface{}, error) {
	var values map[string]interface{}
	valuesBytes, _ := json.Marshal(renderedHelmObjects["Values"])
	err := json.Unmarshal(valuesBytes, &values)
	if err != nil {
		return nil, err
	}
	return values, nil
}

func (helmTemplate HelmTemplate) overrideValues(
	chartValues map[string]interface{}, overrideValues map[string]string,
) (map[string]interface{}, error) {
	chartValuesBytes, _ := json.Marshal(chartValues)
	log.WithFields(log.Fields{"function": "overrideValues"}).Info("START:OVERRIDE_VALUES", string(chartValuesBytes))

	newChartValueBytes, err := helmTemplate.overrideValueInChartValueBytes(chartValuesBytes, overrideValues)
	if err != nil {
		return nil, err
	}
	newChartValue, err := helmTemplate.chartValueBytesToStructure(newChartValueBytes)
	if err != nil {
		return nil, err
	}

	chartValuesOverrideBytes, _ := json.Marshal(newChartValue)
	log.WithFields(log.Fields{"function": "overrideValues"}).Info("FINISH:OVERRIDE_VALUES", string(chartValuesOverrideBytes))
	return newChartValue, nil
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

		d := kubeyaml.NewYAMLOrJSONDecoder(bytes.NewReader([]byte(manifest)), 4096)
		ext := runtime.RawExtension{}
		if err := d.Decode(&ext); err != nil {
			return nil, err
		}

		ext.Raw = bytes.TrimSpace(ext.Raw)
		if len(ext.Raw) == 0 || bytes.Equal(ext.Raw, []byte("null")) {
			continue
		}

		u := &unstructured.Unstructured{}
		if err := kubeyaml.Unmarshal(ext.Raw, u); err != nil {
			return nil, fmt.Errorf("failed to unmarshal manifest: %v", err)
		}

		encodedManifests[key] = u.Object
	}

	return encodedManifests, nil
}
