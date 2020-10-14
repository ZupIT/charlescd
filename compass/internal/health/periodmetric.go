package health

import (
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
)

type ComponentMetricRepresentation struct {
	Period     string                    `json:"period"`
	Type       string                    `json:"type"`
	Components []ComponentRepresentation `json:"components"`
}

type ComponentRepresentation struct {
	Name   string                `json:"name"`
	Module string                `json:"module"`
	Data   []datasourcePKG.Value `json:"data"`
}

// TODO: Send lookup plugin method to plugin pkg
func (main Main) getQueryPeriod(workspaceId, query string, period, interval datasourcePKG.Period) ([]datasourcePKG.Value, error) {
	datasource, err := main.datasource.FindHealthByWorkspaceId(workspaceId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getHealthPlugin", err, "prometheus")
		return nil, err
	}

	plugin, err := main.pluginMain.GetPluginBySrc(datasource.PluginSrc)
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

func (main Main) getDatasourceValuesByMetricType(workspaceId, circleId, projectionType, metricType string) ([]datasourcePKG.Value, error, string) {
	switch metricType {
	case "REQUESTS_BY_CIRCLE":
		query := main.getTotalRequestStringQuery(workspaceId, circleId, true)
		period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
		values, err := main.getQueryPeriod(workspaceId, query, period, interval)

		return values, err, REQUESTS_BY_CIRCLE
	case "REQUESTS_ERRORS_BY_CIRCLE":
		query := main.GetAverageHttpErrorsPercentageStringQuery(workspaceId, circleId)
		period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
		values, err := main.getQueryPeriod(workspaceId, query, period, interval)

		return values, err, REQUESTS_ERRORS_BY_CIRCLE
	case "REQUESTS_LATENCY_BY_CIRCLE":
		query := main.GetAverageLatencyStringQuery(workspaceId, circleId)
		period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
		values, err := main.getQueryPeriod(workspaceId, query, period, interval)

		return values, err, REQUESTS_LATENCY_BY_CIRCLE
	default:
		return nil, errors.New("Not found metric type"), ""
	}
}

func (main Main) Components(circleIDHeader, workspaceId, circleId, projectionType, metricType string) (ComponentMetricRepresentation, error) {
	metricComponents := ComponentMetricRepresentation{
		Period: projectionType,
		Type:   metricType,
	}

	body, err := main.mooveMain.GetMooveComponents(circleIDHeader, circleId, workspaceId)
	if err != nil {
		return ComponentMetricRepresentation{}, err
	}

	var components []DeploymentInCircle
	err = json.Unmarshal(body, &components)
	if err != nil {
		return ComponentMetricRepresentation{}, err
	}

	for _, component := range components {
		data, err, _ := main.getDatasourceValuesByMetricType(workspaceId, circleId, projectionType, metricType)
		if err != nil {
			return ComponentMetricRepresentation{}, err
		}

		metricComponents.Components = append(metricComponents.Components, ComponentRepresentation{
			Name:   component.Name,
			Module: component.ModuleName,
			Data:   data,
		})
	}

	return metricComponents, nil
}
