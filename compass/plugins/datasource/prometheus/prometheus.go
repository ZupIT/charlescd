/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package main

import (
	"compass/pkg/datasource"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
)

func getPrometheusApiClient(datasourceConfiguration []byte) (api.Client, error) {
	var prometheusConfig map[string]string
	_ = json.Unmarshal(datasourceConfiguration, &prometheusConfig)

	apiConf := api.Config{
		Address: prometheusConfig["url"],
	}

	return api.NewClient(apiConf)
}

func getErrorMoreThanOneResultByQuery(query string) error {
	return errors.New("Your query returned more than one result. Add a filter to your query or review the desired metric: " + query)
}

func getDatasourceValuesByPrometheusVectorResult(query string, prometheusResult model.Vector) ([]datasource.Value, error) {
	if prometheusResult.Len() > 1 {
		return nil, getErrorMoreThanOneResultByQuery(string(query))
	}

	datasourceValues := []datasource.Value{}
	for _, value := range prometheusResult {
		valueParsed, err := strconv.ParseFloat(value.Value.String(), 64)
		if err != nil {
			return nil, err
		}

		if math.IsNaN(valueParsed) {
			valueParsed = 0
		}

		datasourceValues = append(datasourceValues, datasource.Value{
			Total:  valueParsed,
			Period: value.Timestamp.String(),
		})
	}

	return datasourceValues, nil
}

func getDatasourceValuesByPrometheusVectorMetrix(query string, prometheusResult model.Matrix) ([]datasource.Value, error) {
	if prometheusResult.Len() > 1 {
		return nil, getErrorMoreThanOneResultByQuery(string(query))
	}

	datasourceValues := []datasource.Value{}
	for _, matrixVector := range prometheusResult {
		for _, value := range matrixVector.Values {
			valueParsed, err := strconv.ParseFloat(value.Value.String(), 64)
			if err != nil {
				return nil, err
			}

			if math.IsNaN(valueParsed) {
				valueParsed = 0
			}

			datasourceValues = append(datasourceValues, datasource.Value{
				Total:  valueParsed,
				Period: value.Timestamp.String(),
			})
		}
	}

	return datasourceValues, nil
}

func TestConnection(datasourceConfiguration []byte) error {
	_, err := GetMetrics(datasourceConfiguration)
	if err != nil {
		return err
	}

	return nil
}

func GetMetrics(datasourceConfiguration []byte) (datasource.MetricList, error) {
	apiClient, err := getPrometheusApiClient(datasourceConfiguration)
	if err != nil {
		return nil, err
	}

	v1Api := v1.NewAPI(apiClient)
	namedLabels := "__name__"
	labelValues, _, err := v1Api.LabelValues(context.Background(), namedLabels, time.Now(), time.Now())
	if err != nil {
		return nil, err
	}

	metricList := []string{}
	for _, label := range labelValues {
		metricList = append(metricList, string(label))
	}

	return metricList, nil
}

func Query(request datasource.QueryRequest) ([]datasource.Value, error) {
	apiClient, err := getPrometheusApiClient(request.DatasourceConfiguration)
	if err != nil {
		return nil, err
	}

	v1Api := v1.NewAPI(apiClient)
	buildedQuery := createQueryByMetric(request.Filters, request.Query, "", "")
	if request.RangePeriod.Value != 0 && request.RangePeriod.Unit != "" {
		buildedRangePeriod := fmt.Sprintf("%d%s", request.RangePeriod.Value, request.RangePeriod.Unit)
		buildedInterval := fmt.Sprintf("%d%s", request.Interval.Value, request.Interval.Unit)
		buildedQuery = createQueryByMetric(request.Filters, request.Query, buildedRangePeriod, buildedInterval)
	}

	result, _, err := v1Api.Query(context.Background(), buildedQuery, time.Now())
	if err != nil {
		return nil, err
	}

	switch result.Type() {
	case model.ValVector:
		return getDatasourceValuesByPrometheusVectorResult(buildedQuery, result.(model.Vector))
	case model.ValMatrix:
		return getDatasourceValuesByPrometheusVectorMetrix(buildedQuery, result.(model.Matrix))
	default:
		return nil, errors.New("Unsuported result type")
	}
}

func Result(request datasource.ResultRequest) (float64, error) {
	values, err := Query(datasource.QueryRequest{request, datasource.Period{}, datasource.Period{}})
	if err != nil {
		return 0, err
	}

	if len(values) <= 0 {
		return 0, nil
	}

	var resultQuery = 0
	return values[resultQuery].Total, nil
}
