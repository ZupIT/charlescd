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

func GetLists(configurationData []byte) (datasource.MetricList, error) {

	var prometheusConfig PrometheusConfig
	_ = json.Unmarshal(configurationData, &prometheusConfig)

	res, err := http.Get(prometheusConfig.Url)
	if err != nil {
		return datasource.MetricList{}, errors.New("FAILED GET: " + string(configurationData))
	}

	var result interface{}
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return datasource.MetricList{}, errors.New("FAILED DECODER: " + err.Error())
	}

	fmt.Println(result)

	return datasource.MetricList{}, nil
}

func Query() {

}
