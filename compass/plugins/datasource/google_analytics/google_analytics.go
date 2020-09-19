package main

import (
	"compass/pkg/datasource"
	"context"
	"encoding/json"
	"strconv"

	"google.golang.org/api/analytics/v3"
	"google.golang.org/api/analyticsreporting/v4"
	"google.golang.org/api/option"
)

type Configuration struct {
	ServiceAccount string `json:"serviceAccount"`
}

var Periods = map[string]string{
	"s":   "s",
	"m":   "m",
	"h":   "h",
	"d":   "d",
	"w":   "w",
	"y":   "y",
	"MAX": "MAX",
}

func getServices(datasourceConfiguration []byte) (analytics.Service, analyticsreporting.Service, error) {
	ctx := context.Background()

	configuration := Configuration{}
	err := json.Unmarshal(datasourceConfiguration, &configuration)
	if err != nil {
		return analytics.Service{}, analyticsreporting.Service{}, err
	}

	serviceAccountJSON := `
	`

	analyticsService, err := analytics.NewService(ctx, option.WithCredentialsJSON([]byte(configuration.ServiceAccount)))
	if err != nil {
		return analytics.Service{}, analyticsreporting.Service{}, err
	}

	analyticsReportingService, err := analyticsreporting.NewService(ctx, option.WithCredentialsJSON([]byte(serviceAccountJSON)))
	if err != nil {
		return analytics.Service{}, analyticsreporting.Service{}, err
	}

	return *analyticsService, *analyticsReportingService, nil
}

func GetMetrics(datasourceConfiguration []byte) (datasource.MetricList, error) {

	analyticsService, _, err := getServices(datasourceConfiguration)
	if err != nil {
		return nil, err
	}

	defaultColumnReference := "ga"
	metadataColumns := analyticsService.Metadata.Columns.List(defaultColumnReference)
	res, err := metadataColumns.Do()
	if err != nil {
		return nil, err
	}

	metrics := []string{}
	for _, item := range res.Items {
		metrics = append(metrics, item.Id)
	}

	return metrics, nil
}

func Query(request datasource.QueryRequest) ([]datasource.Value, error) {
	_, analyticsReportingService, err := getServices(request.DatasourceConfiguration)
	if err != nil {
		return nil, err
	}

	reportRequestData := &analyticsreporting.GetReportsRequest{
		ReportRequests: []*analyticsreporting.ReportRequest{
			{
				ViewId: "228901918",
				DateRanges: []*analyticsreporting.DateRange{
					{
						StartDate: "2020-09-16",
						EndDate:   "2020-09-18",
					},
				},
				Dimensions: []*analyticsreporting.Dimension{
					{
						Name: "ga:day",
					},
				},
				Metrics: []*analyticsreporting.Metric{
					{
						Expression: "ga:pageviews",
					},
				},
			},
		},
	}

	batchGetCall := analyticsReportingService.Reports.BatchGet(reportRequestData)
	if err != nil {
		return nil, err
	}

	res, err := batchGetCall.Do()
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

		values = append(values, datasource.Value{
			Total:  float64(total),
			Period: dimension,
		})
	}

	return values, nil
}

func Result(request datasource.ResultRequest) (float64, error) {
	return 0, nil
}
