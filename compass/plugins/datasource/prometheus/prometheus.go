package main

import (
	"compass/internal/metricsgroup"
	"compass/pkg/datasource"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
)

type APIError struct {
	Error     string `json:"error"`
	ErrorType string `json:"errorType"`
	Status    string `json:"status"`
}

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
	Result     []map[string]interface{} `json:"result"`
	ResultType string                   `json:"resultType"`
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

func getMetricLengthErrorByMetric(metric metricsgroup.Metric) error {
	metricError := ""
	if metric.Query != "" {
		metricError = metric.Query
	} else {
		metricError = metric.Metric
	}

	return errors.New("Your query returned more than one result. Add a filter to your query or review the desired metric: " + metricError)
}

func getResultValue(result PrometheusDataResponse) (interface{}, error) {
	resultValues := map[string]interface{}{
		"matrix": result.Data.Result[0]["values"],
		"vector": result.Data.Result[0]["value"],
	}

	if resultValue, ok := resultValues[result.Data.ResultType]; ok {
		return resultValue, nil
	}

	return nil, errors.New("Result type not valid")
}

func doPrometheusRequestByMetric(basePath string, period string, metric metricsgroup.Metric) (*http.Response, error) {
	path := "/api/v1/query"
	query := ""
	if metric.Query != "" {
		query = metric.Query
	} else {
		query = createQueryByMetric(metric, string(period))
	}
	Url, err := url.Parse(fmt.Sprintf("%s%s", basePath, path))
	if err != nil {
		return nil, err
	}

	completePath := fmt.Sprintf("%s?query=%s", Url.String(), url.PathEscape(query))
	res, err := http.Get(completePath)
	if err != nil {
		return nil, errors.New("FAILED QUERY: " + query)
	}

	if res.StatusCode != 200 {
		var apiError APIError
		_ = json.NewDecoder(res.Body).Decode(&apiError)
		return nil, errors.New(apiError.Error)
	}

	return res, nil
}

func Query(datasourceConfiguration, metric, period []byte) (interface{}, error) {

	var prometheusConfig PrometheusConfig
	_ = json.Unmarshal(datasourceConfiguration, &prometheusConfig)

	var currentMetric metricsgroup.Metric
	_ = json.Unmarshal(metric, &currentMetric)

	res, err := doPrometheusRequestByMetric(prometheusConfig.Url, string(period), currentMetric)
	if err != nil {
		return nil, err
	}

	var result PrometheusDataResponse
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return nil, errors.New("FAILED DECODER: " + err.Error())
	}

	switch len(result.Data.Result) {
	case 1:
		return getResultValue(result)
	case 0:
		return []interface{}{}, nil
	default:
		return nil, getMetricLengthErrorByMetric(currentMetric)
	}
}

func Result(datasourceConfiguration, metric []byte) (float64, error) {
	query, err := Query(datasourceConfiguration, metric, []byte(""))
	if err != nil {
		return 0, err
	}

	resultValue := query.([]interface{})

	if len(resultValue) == 0 {
		return 0, nil
	}

	count, err := strconv.Atoi(resultValue[1].(string))
	if err != nil {
		return 0, err
	}

	return float64(count), nil

}
