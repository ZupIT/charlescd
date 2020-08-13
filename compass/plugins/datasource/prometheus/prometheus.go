package main

import (
	"compass/internal/metricsgroup"
	"compass/pkg/datasource"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
)

type PrometheusConfig struct {
	Url string `json:"url"`
}

type PrometheusMetricsResponse struct {
	Status string   `json:"status"`
	Data   []string `json:"data"`
}

type PrometheusResultResponse struct {
	Metric interface{} `json:"metric"`
	Values interface{} `json:"values"`
}

type PrometheusResultsResponse struct {
	Result []map[string]interface{} `json:"result"`
}

type PrometheusDataResponse struct {
	Data PrometheusResultsResponse `json:"data"`
}

func GetLists(configurationData []byte) (datasource.MetricList, error) {
	path := "/api/v1/label/__name__/values"

	var prometheusConfig PrometheusConfig
	_ = json.Unmarshal(configurationData, &prometheusConfig)

	res, err := http.Get(fmt.Sprintf("%s%s", prometheusConfig.Url, path))
	if err != nil {
		return datasource.MetricList{}, errors.New("FAILED GET: " + string(configurationData))
	}

	var result PrometheusMetricsResponse
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return datasource.MetricList{}, errors.New("FAILED DECODER: " + err.Error())
	}

	return result.Data, nil
}

func Query(datasourceConfiguration, metric, period []byte) (interface{}, error) {
	path := "/api/v1/query"

	var prometheusConfig PrometheusConfig
	_ = json.Unmarshal(datasourceConfiguration, &prometheusConfig)

	var currentMetric metricsgroup.Metric
	_ = json.Unmarshal(metric, &currentMetric)

	query := createQueryByMetric(currentMetric, string(period))
	Url, err := url.Parse(fmt.Sprintf("%s%s", prometheusConfig.Url, path))
	if err != nil {
		return nil, err
	}

	queryParams := url.Values{}
	queryParams.Add("query", query)
	Url.RawQuery = queryParams.Encode()
	res, err := http.Get(Url.String())
	if err != nil {
		return nil, errors.New("FAILED QUERY: " + query)
	}

	var result PrometheusDataResponse
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return nil, errors.New("FAILED DECODER: " + err.Error())
	}

	if len(result.Data.Result) == 1 {
		return result.Data.Result[0]["value"], nil
	} else if len(result.Data.Result) <= 0 {
		return []interface{}{}, nil
	}

	return nil, errors.New("Your query returned more than one result. Add a filter to your query or review the desired metric")
}
