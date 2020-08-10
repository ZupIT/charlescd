package main

import (
	"compass/pkg/datasource"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
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

func Query() {

}
