package health

import (
	"compass/internal/configuration"
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

const (
	REQUESTS_BY_CIRCLE         = "req/s"
	REQUESTS_ERRORS_BY_CIRCLE  = "%"
	REQUESTS_LATENCY_BY_CIRCLE = "ms"
)

type ComponentMetricRepresentation struct {
	Period     string
	Type       string
	Components []ComponentRepresentation
}

type ComponentRepresentation struct {
	Name   string
	Module string
	Data   []datasourcePKG.Value
}

func (main Main) getHealthPlugin(workspaceId, query string, period, interval datasourcePKG.Period) ([]datasourcePKG.Value, error) {
	datasource, err := main.datasource.FindHealthByWorkspaceId(workspaceId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getHealthPlugin", err, "prometheus")
		return nil, err
	}

	plugin, err := main.pluginMain.GetPluginBySrc("prometheus")
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getHealthPlugin", err, "prometheus")
		return nil, err
	}

	getQuery, err := plugin.Lookup("Query")
	if err != nil {
		logger.Error(util.PluginLookupError, "getHealthPlugin", err, plugin)
		return nil, err
	}

	return getQuery.(func(request datasourcePKG.QueryRequest) ([]datasourcePKG.Value, error))(datasourcePKG.QueryRequest{
		ResultRequest: datasourcePKG.ResultRequest{
			DatasourceConfiguration: datasource.Data,
			Query:                   query,
			Filters:                 []datasourcePKG.MetricFilter{},
		},
		RangePeriod: period,
		Interval:    interval,
	})
}

func (main Main) getPeriodAndIntervalByProjectionType(projectionType string) (datasourcePKG.Period, datasourcePKG.Period) {
	period := allProjectionsType[projectionType][0]
	interval := allProjectionsType[projectionType][1]

	return period, interval
}

func (main Main) GetTotalRequests(workspaceId, projectionType, circleSource string, isGrouped bool) ([]datasourcePKG.Value, error) {
	groupBy := ""
	if isGrouped {
		groupBy = "by(destination_component)"
	}

	metricName := "istio_charles_requests_total"
	query := fmt.Sprintf("ceil(sum(irate(%s{circle_source=%s}[1m])) %s)", metricName, circleSource, groupBy)
	period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)

	return main.getHealthPlugin(workspaceId, query, period, interval)
}

func (main Main) GetAverageLatency(workspaceId, circleSource, projectionType string) ([]datasourcePKG.Value, error) {
	metricName := "istio_charles_request_duration_seconds"
	query := fmt.Sprintf("round((sum(irate(%s_sum{circle_source=%s}[1m])) by(destination_component) / sum(irate(%s_count{circle_source=%s}[1m])) by(destination_component) * 1000)", metricName, circleSource, metricName, circleSource)

	period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
	return main.getHealthPlugin(workspaceId, query, period, interval)
}

func (main Main) GetAverageHttpErrorsPercentage(workspaceId, circleSource, projectionType string) ([]datasourcePKG.Value, error) {
	metricName := "istio_charles_request_total"
	filter := fmt.Sprintf("circle_source=%s", circleSource)
	finalFilter := fmt.Sprintf("%s, response_status=~\"^5.*$\"", filter)
	query := fmt.Sprintf("round((sum(irate(%s{%s}[1m])) by(destination_component) scalar(sum(irate(%s{%s}[1m])) by(destination_component) * 100), 0.01)", metricName, finalFilter, metricName, filter)

	period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
	return main.getHealthPlugin(workspaceId, query, period, interval)
}

func (main Main) getMooveComponents(circleId string) ([]map[string]string, error) {
	mooveUrl := fmt.Sprintf("%s/v2/circles/%s", configuration.GetConfiguration("MOOVE_URL"), circleId)

	res, err := http.Get(mooveUrl)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		return nil, errors.New("Internal server error")
	}

	var body map[string]interface{}
	err = json.NewDecoder(res.Body).Decode(&body)
	if err != nil {
		return nil, err
	}

	deployment := body["deployment"].(map[string]interface{})
	artifacts := deployment["artifacts"].([]map[string]interface{})

	components := []map[string]string{}
	for _, artifact := range artifacts {
		components = append(components, map[string]string{
			"componentName": artifact["componentName"].(string),
			"moduleName":    artifact["moduleName"].(string),
		})
	}

	return components, nil
}

func (main Main) ComponentsHealth(workspaceId, circleId, projectionType, metricType string) {
	// TODO: CREATE COMPONENTS HEALTH METRIC
}

func (main Main) getDatasourceValuesByMetricType(workspaceId, circleId, projectionType, metricType string) ([]datasourcePKG.Value, error) {
	switch metricType {
	case "REQUESTS_BY_CIRCLE":
		return main.GetTotalRequests(workspaceId, projectionType, circleId, true)
	case "REQUESTS_ERRORS_BY_CIRCLE":
		return main.GetAverageLatency(workspaceId, circleId, projectionType)
	case "REQUESTS_LATENCY_BY_CIRCLE":
		return main.GetAverageHttpErrorsPercentage(workspaceId, circleId, projectionType)
	default:
		return nil, errors.New("Not found metric type")
	}
}

func (main Main) Components(workspaceId, circleId, projectionType, metricType string) (ComponentMetricRepresentation, error) {
	metricComponents := ComponentMetricRepresentation{}
	components, err := main.getMooveComponents(circleId)
	if err != nil {
		return ComponentMetricRepresentation{}, err
	}

	for _, component := range components {
		data, err := main.getDatasourceValuesByMetricType(workspaceId, circleId, projectionType, metricType)
		if err != nil {
			return ComponentMetricRepresentation{}, err
		}

		metricComponents.Components = append(metricComponents.Components, ComponentRepresentation{
			Name:   component["componentName"],
			Module: component["moduleName"],
			Data:   data,
		})
	}

	return metricComponents, nil
}
