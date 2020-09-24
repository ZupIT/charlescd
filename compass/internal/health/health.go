package health

import (
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"compass/pkg/logger"
	"fmt"
)

const (
	REQUESTS_BY_CIRCLE         = "req/s"
	REQUESTS_ERRORS_BY_CIRCLE  = "%"
	REQUESTS_LATENCY_BY_CIRCLE = "ms"
)

type MetricDataRepresentation struct {
	Timestamp string
	Value     int64
}

type ComponentsRepresentation struct {
	Period string
	Type   string
	Data   []MetricDataRepresentation
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
		datasourcePKG.ResultRequest{
			datasource.Data,
			query,
			[]datasourcePKG.MetricFilter{},
		},
		period,
		interval,
	})
}

func (main Main) GetTotalRequests(workspaceId, projectionType, circleSource string, isGrouped bool) ([]datasourcePKG.Value, error) {
	groupBy := ""
	if isGrouped {
		groupBy = "by(destination_component)"
	}

	metricName := "istio_charles_requests_total"
	query := fmt.Sprintf("ceil(sum(irate(%s{circle_source=%s}[1m])) %s)", metricName, circleSource, groupBy)

	period := allProjectionsType[projectionType][0]
	interval := allProjectionsType[projectionType][1]
	return main.getHealthPlugin(workspaceId, query, period, interval)
}

func (main Main) GetAverageLatency(workspaceId, circleSource, projectionType string) ([]datasourcePKG.Value, error) {
	metricName := "istio_charles_request_duration_seconds"
	query := fmt.Sprintf("round((sum(irate(%s_sum{circle_source=%s}[1m])) by(destination_component) / sum(irate(%s_count{circle_source=%s}[1m])) by(destination_component) * 1000)", metricName, circleSource, metricName, circleSource)

	period := allProjectionsType[projectionType][0]
	interval := allProjectionsType[projectionType][1]
	return main.getHealthPlugin(workspaceId, query, period, interval)
}

func (main Main) GetAverageHttpErrorsPercentage(workspaceId, circleSource, projectionType string) ([]datasourcePKG.Value, error) {
	metricName := "istio_charles_request_total"
	filter := fmt.Sprintf("circle_source=%s", circleSource)
	finalFilter := fmt.Sprintf("%s, response_status=~\"^5.*$\"", filter)
	query := fmt.Sprintf("round((sum(irate(%s{%s}[1m])) by(destination_component) scalar(sum(irate(%s{%s}[1m])) by(destination_component) * 100), 0.01)", metricName, finalFilter, metricName, filter)

	period := allProjectionsType[projectionType][0]
	interval := allProjectionsType[projectionType][1]
	return main.getHealthPlugin(workspaceId, query, period, interval)
}

func (main Main) Components(workspaceId, circleId, projectionType, metricType string) {
	switch metricType {
	case "REQUESTS_BY_CIRCLE":
		return main.GetTotalRequests(circleId, true)
	case "REQUESTS_ERRORS_BY_CIRCLE":
		return GetAverageLatency(circleId)
	case "REQUESTS_LATENCY_BY_CIRCLE":
		return GetAverageHttpErrorsPercentage(circleId)
	}
}
