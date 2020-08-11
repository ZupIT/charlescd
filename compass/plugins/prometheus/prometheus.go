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

func Query(datasourceConfiguration, metric []byte) (interface{}, error) {
	path := "/api/v1/query"

	var prometheusConfig PrometheusConfig
	_ = json.Unmarshal(datasourceConfiguration, &prometheusConfig)

	var currentMetric metricsgroup.Metric
	_ = json.Unmarshal(metric, &currentMetric)

	query := createQueryByMetric(currentMetric)

	fmt.Println(query)

	Url, err := url.Parse(fmt.Sprintf("%s%s", prometheusConfig.Url, path))
	queryParams := url.Values{}
	queryParams.Add("query", query)
	Url.RawQuery = queryParams.Encode()
	res, err := http.Get(Url.String())
	if err != nil {
		return nil, errors.New("FAILED QUERY: " + query)
	}

	var result interface{}
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return nil, errors.New("FAILED DECODER: " + err.Error())
	}

	return result, nil
}
