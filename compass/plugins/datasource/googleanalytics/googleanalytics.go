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
	"strconv"
	"time"

	"google.golang.org/api/analytics/v3"
	"google.golang.org/api/analyticsreporting/v4"
	"google.golang.org/api/option"
)

type Configuration struct {
	ViewId         string `json:"viewId"`
	ServiceAccount string `json:"serviceAccount"`
}

func parseDatasourceConfiguration(datasourceConfiguration []byte) (Configuration, error) {
	configuration := Configuration{}
	err := json.Unmarshal(datasourceConfiguration, &configuration)
	if err != nil {
		return Configuration{}, err
	}

	return configuration, nil
}

func getServiceAccountJSON(serviceAccountData string) (json.RawMessage, error) {
	var newServiceAccount json.RawMessage

	err := json.Unmarshal([]byte(serviceAccountData), &newServiceAccount)
	if err != nil {
		return json.RawMessage{}, err
	}

	return newServiceAccount, nil
}

func getServices(configuration Configuration) (analytics.Service, analyticsreporting.Service, error) {
	ctx := context.Background()

	serviceAccount, err := getServiceAccountJSON(configuration.ServiceAccount)
	if err != nil {
		return analytics.Service{}, analyticsreporting.Service{}, err
	}

	analyticsService, err := analytics.NewService(ctx, option.WithCredentialsJSON(serviceAccount))
	if err != nil {
		return analytics.Service{}, analyticsreporting.Service{}, err
	}

	analyticsReportingService, err := analyticsreporting.NewService(ctx, option.WithCredentialsJSON(serviceAccount))
	if err != nil {
		return analytics.Service{}, analyticsreporting.Service{}, err
	}

	return *analyticsService, *analyticsReportingService, nil
}

func doRequest(request datasource.QueryRequest) (analyticsreporting.GetReportsResponse, error) {
	configuration, err := parseDatasourceConfiguration(request.DatasourceConfiguration)
	if err != nil {
		return analyticsreporting.GetReportsResponse{}, err
	}

	_, analyticsReportingService, err := getServices(configuration)
	if err != nil {
		return analyticsreporting.GetReportsResponse{}, err
	}

	reportRequestData := &analyticsreporting.GetReportsRequest{
		ReportRequests: []*analyticsreporting.ReportRequest{
			{
				ViewId: configuration.ViewId,
				Metrics: []*analyticsreporting.Metric{
					{
						Expression: request.Query,
					},
				},
			},
		},
	}

	if request.RangePeriod.Value != 0 && request.RangePeriod.Unit != "" {
		currentPeriod, ok := Periods[request.RangePeriod.Unit]
		if !ok {
			return analyticsreporting.GetReportsResponse{}, errors.New("This period not supported...")
		}

		analyticsPeriod := currentPeriod(request.RangePeriod)

		reportRequestData.ReportRequests[0].DateRanges = []*analyticsreporting.DateRange{
			{
				StartDate: analyticsPeriod.StartDate,
				EndDate:   analyticsPeriod.EndDate,
			},
		}

		reportRequestData.ReportRequests[0].Dimensions = analyticsPeriod.Dimensions
		reportRequestData.ReportRequests[0].FiltersExpression = analyticsPeriod.Filters
	}

	batchGetCall := analyticsReportingService.Reports.BatchGet(reportRequestData)
	if err != nil {
		return analyticsreporting.GetReportsResponse{}, err
	}

	res, err := batchGetCall.Do()
	if err != nil {
		return analyticsreporting.GetReportsResponse{}, err
	}

	return *res, nil
}

func getUnixTimestampByDimension(dimension string) (string, error) {
	year := dimension[0:4]
	month := dimension[4:6]
	day := dimension[6:8]
	hour := dimension[8:10]
	minute := dimension[10:12]

	date, err := time.Parse(time.RFC3339, fmt.Sprintf("%s-%s-%sT%s:%s:00+00:00", year, month, day, hour, minute))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%d", date.Unix()), nil
}

func TestConnection(datasourceConfiguration []byte) error {
	_, err := GetMetrics(datasourceConfiguration)
	if err != nil {
		return err
	}

	return nil
}

func GetMetrics(datasourceConfiguration []byte) (datasource.MetricList, error) {
	configuration, err := parseDatasourceConfiguration(datasourceConfiguration)
	if err != nil {
		return nil, err
	}

	analyticsService, _, err := getServices(configuration)
	if err != nil {
		return nil, err
	}

	defaultColumnReference := "ga"
	metadataColumns := analyticsService.Metadata.Columns.List(defaultColumnReference)
	res, err := metadataColumns.Do()
	if err != nil {
		return nil, err
	}

	metricType := "METRIC"
	metrics := []string{}
	for _, item := range res.Items {
		if item.Attributes["type"] == metricType {
			metrics = append(metrics, item.Id)
		}
	}

	return metrics, nil
}

func Query(request datasource.QueryRequest) ([]datasource.Value, error) {
	res, err := doRequest(request)
	if err != nil {
		return nil, err
	}

	values := []datasource.Value{}
	if len(res.Reports) <= 0 {
		return []datasource.Value{}, nil
	}

	for _, row := range res.Reports[0].Data.Rows {
		dimension := row.Dimensions[0]
		metricValue := row.Metrics[0].Values[0]
		total, err := strconv.Atoi(metricValue)
		if err != nil {
			return nil, err
		}

		unixTimestamp, err := getUnixTimestampByDimension(dimension)
		if err != nil {
			return nil, err
		}

		values = append(values, datasource.Value{
			Total:  float64(total),
			Period: unixTimestamp,
		})
	}

	return values, nil
}

func Result(request datasource.ResultRequest) (float64, error) {
	res, err := doRequest(datasource.QueryRequest{
		ResultRequest: request,
		RangePeriod:   datasource.Period{},
		Interval:      datasource.Period{},
	})
	if err != nil {
		return 0, err
	}

	if len(res.Reports) > 0 && len(res.Reports[0].Data.Rows) > 0 {
		row := res.Reports[0].Data.Rows[0]
		value, err := strconv.Atoi(row.Metrics[0].Values[0])
		if err != nil {
			return 0, nil
		}

		return float64(value), nil
	}

	return 0, nil
}
