package main

import (
	"compass/pkg/datasource"
	"context"
	"encoding/json"
	"errors"
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

func Query(datasourceConfiguration, query, filters, period []byte) ([]datasource.Value, error) {
	apiClient, err := getPrometheusApiClient(datasourceConfiguration)
	if err != nil {
		return nil, err
	}

	v1Api := v1.NewAPI(apiClient)
	result, _, err := v1Api.Query(context.Background(), string(query), time.Now())
	if err != nil {
		return nil, err
	}

	switch result.Type() {
	case model.ValVector:
		vectorResult := result.(model.Vector)

		if vectorResult.Len() > 1 {
			return nil, errors.New("Your query returned more than one result. Add a filter to your query or review the desired metric: " + string(query))
		}

		values := []datasource.Value{}
		for _, value := range vectorResult {
			valueParsed, err := strconv.ParseFloat(value.Value.String(), 64)
			if err != nil {
				return nil, err
			}

			values = append(values, datasource.Value{
				Total:  valueParsed,
				Period: value.Timestamp.String(),
			})
		}

		return values, nil
	case model.ValMatrix:
		matrixResult := result.(model.Matrix)

		if matrixResult.Len() > 1 {
			return nil, errors.New("Your query returned more than one result. Add a filter to your query or review the desired metric: " + string(query))
		}

		values := []datasource.Value{}
		for _, matrixVector := range matrixResult {
			for _, value := range matrixVector.Values {
				valueParsed, err := strconv.ParseFloat(value.Value.String(), 64)
				if err != nil {
					return nil, err
				}

				values = append(values, datasource.Value{
					Total:  valueParsed,
					Period: value.Timestamp.String(),
				})
			}
		}

		return values, nil

	default:
		return nil, errors.New("")
	}
}

func Result(datasourceConfiguration, query, filters []byte) (float64, error) {
	values, err := Query(datasourceConfiguration, query, filters, []byte(""))
	if err != nil {
		return 0, err
	}

	if len(values) <= 0 {
		return 0, nil
	}

	var resultQuery = 0

	return values[resultQuery].Total, nil
}
