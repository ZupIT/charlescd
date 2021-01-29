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

package health

import (
	"encoding/json"

	"github.com/ZupIT/charlescd/compass/pkg/errors"

	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
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
func (main Main) getQueryPeriod(query string, period, interval datasourcePKG.Period, workspaceId uuid.UUID) ([]datasourcePKG.Value, errors.Error) {
	datasource, err := main.datasource.FindHealthByWorkspaceId(workspaceId)
	if err != nil {
		return nil, err.WithOperations("getQueryPeriod.FindHealthByWorkspaceId")
	}

	plugin, err := main.pluginMain.GetPluginBySrc(datasource.PluginSrc)
	if err != nil {
		return nil, err.WithOperations("getQueryPeriod.GetPluginBySrc")
	}

	getQuery, lookupErr := plugin.Lookup("Query")
	if lookupErr != nil {
		return nil, errors.NewError("Get error", lookupErr.Error()).
			WithOperations("getQueryPeriod.Lookup")
	}

	values, getQueryErr := getQuery.(func(request datasourcePKG.QueryRequest) ([]datasourcePKG.Value, error))(datasourcePKG.QueryRequest{
		ResultRequest: datasourcePKG.ResultRequest{
			DatasourceConfiguration: datasource.Data,
			Query:                   query,
			Filters:                 []datasourcePKG.MetricFilter{},
		},
		RangePeriod: period,
		Interval:    interval,
	})

	if getQueryErr != nil {
		return nil, errors.NewError("Get error", getQueryErr.Error()).
			WithOperations("getQueryPeriod.getQuery")
	}

	return values, nil
}

func (main Main) getPeriodAndIntervalByProjectionType(projectionType string) (datasourcePKG.Period, datasourcePKG.Period) {
	period := allProjectionsType[projectionType][0]
	interval := allProjectionsType[projectionType][1]

	return period, interval
}

func (main Main) getDatasourceValuesByMetricType(circleId, projectionType, metricType string, workspaceID uuid.UUID) ([]datasourcePKG.Value, errors.Error, string) {
	switch metricType {
	case "REQUESTS_BY_CIRCLE":
		query := main.getTotalRequestStringQuery(circleId, true)
		period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
		values, err := main.getQueryPeriod(query, period, interval, workspaceID)

		return values, err, REQUESTS_BY_CIRCLE
	case "REQUESTS_ERRORS_BY_CIRCLE":
		query := main.GetAverageHttpErrorsPercentageStringQuery(circleId)
		period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
		values, err := main.getQueryPeriod(query, period, interval, workspaceID)

		return values, err, REQUESTS_ERRORS_BY_CIRCLE
	case "REQUESTS_LATENCY_BY_CIRCLE":
		query := main.GetAverageLatencyStringQuery(circleId)
		period, interval := main.getPeriodAndIntervalByProjectionType(projectionType)
		values, err := main.getQueryPeriod(query, period, interval, workspaceID)

		return values, err, REQUESTS_LATENCY_BY_CIRCLE
	default:
		return nil, errors.NewError("Get error", "not found metric type").
			WithOperations("getQueryPeriod.Lookup"), ""
	}
}

func (main Main) Components(circleIDHeader, circleId, projectionType, metricType string, workspaceID uuid.UUID) (ComponentMetricRepresentation, errors.Error) {
	metricComponents := ComponentMetricRepresentation{
		Period: projectionType,
		Type:   metricType,
	}

	body, err := main.mooveMain.GetMooveComponents(circleIDHeader, circleId, workspaceID)
	if err != nil {
		return ComponentMetricRepresentation{}, err.WithOperations("Components.GetMooveComponents")
	}

	var components []DeploymentInCircle
	jsonErr := json.Unmarshal(body, &components)
	if jsonErr != nil {
		return ComponentMetricRepresentation{}, errors.NewError("Get error", jsonErr.Error()).
			WithOperations("Components.Unmarshal")
	}

	for _, component := range components {
		data, err, _ := main.getDatasourceValuesByMetricType(circleId, projectionType, metricType, workspaceID)
		if err != nil {
			return ComponentMetricRepresentation{}, err.WithOperations("Components.getDatasourceValuesByMetricType")
		}

		metricComponents.Components = append(metricComponents.Components, ComponentRepresentation{
			Name:   component.Name,
			Module: component.ModuleName,
			Data:   data,
		})
	}

	return metricComponents, nil
}
