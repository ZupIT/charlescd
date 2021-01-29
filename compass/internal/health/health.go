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

type CircleHealthRepresentation struct {
	Requests CircleRequestsRepresentation   `json:"requests"`
	Latency  CircleHealthTypeRepresentation `json:"latency"`
	Errors   CircleHealthTypeRepresentation `json:"errors"`
}

type CircleRequestsRepresentation struct {
	Value float64 `json:"value"`
	Unit  string  `json:"unit"`
}

type CircleHealthTypeRepresentation struct {
	Unit             string                                `json:"unit"`
	CircleComponents []CircleComponentHealthRepresentation `json:"circleComponents"`
}

type CircleComponentHealthRepresentation struct {
	Name      string  `json:"name"`
	Threshold float64 `json:"threshold"`
	Value     float64 `json:"value"`
	Status    string  `json:"status"`
}

func (main Main) getResultQuery(query string, workspaceID uuid.UUID) (float64, errors.Error) {

	datasource, err := main.datasource.FindHealthByWorkspaceId(workspaceID)
	if err != nil {
		return 0, err.WithOperations("getResultQuery.FindHealthByWorkspaceId")
	}

	plugin, err := main.pluginMain.GetPluginBySrc(datasource.PluginSrc)
	if err != nil {
		return 0, err.WithOperations("getResultQuery.GetPluginBySrc")
	}

	getQuery, lookupErr := plugin.Lookup("Result")
	if lookupErr != nil {
		return 0, errors.NewError("Get error", lookupErr.Error()).
			WithOperations("getResultQuery.Lookup")
	}

	result, getQueryErr := getQuery.(func(request datasourcePKG.ResultRequest) (float64, error))(datasourcePKG.ResultRequest{
		DatasourceConfiguration: datasource.Data,
		Query:                   query,
		Filters:                 []datasourcePKG.MetricFilter{},
	})
	if getQueryErr != nil {
		return 0, errors.NewError("Get error", getQueryErr.Error()).
			WithOperations("getResultQuery.getQuery")
	}

	return result, nil
}

func (main Main) getComponentStatus(thresholdValue, metricValue float64) string {
	if metricValue > thresholdValue {
		return "ERROR"
	} else if metricValue < thresholdValue && metricValue >= thresholdValue-(thresholdValue*0.1) {
		return "WARNING"
	}

	return "STABLE"
}

func (main Main) getComponentsErrorPercentage(circleIDHeader, circleId string, workspaceID uuid.UUID) ([]CircleComponentHealthRepresentation, errors.Error) {
	body, err := main.mooveMain.GetMooveComponents(circleIDHeader, circleId, workspaceID)
	if err != nil {
		return nil, err.WithOperations("getComponentsErrorPercentage.GetMooveComponents")
	}

	var components []DeploymentInCircle
	jsonErr := json.Unmarshal(body, &components)
	if jsonErr != nil {
		return nil, errors.NewError("Get error", jsonErr.Error()).
			WithOperations("getComponentsErrorPercentage.Unmarshal")
	}

	var circleComponents []CircleComponentHealthRepresentation
	for _, component := range components {
		query := main.GetAverageHttpErrorsPercentageStringQuery(circleId)
		value, err := main.getResultQuery(query, workspaceID)
		if err != nil {
			return nil, err.WithOperations("getComponentsErrorPercentage.getResultQuery")
		}

		circleComponents = append(circleComponents, CircleComponentHealthRepresentation{
			Name:      component.Name,
			Value:     value,
			Threshold: component.ErrorThreshold,
			Status:    main.getComponentStatus(component.ErrorThreshold, value),
		})
	}

	return circleComponents, nil
}

func (main Main) getComponentsLatency(circleIDHeader, circleId string, workspaceID uuid.UUID) ([]CircleComponentHealthRepresentation, errors.Error) {
	body, err := main.mooveMain.GetMooveComponents(circleIDHeader, circleId, workspaceID)
	if err != nil {
		return nil, err.WithOperations("getComponentsLatency.GetMooveComponents")
	}

	var components []DeploymentInCircle
	jsonErr := json.Unmarshal(body, &components)
	if jsonErr != nil {
		return nil, errors.NewError("Get error", jsonErr.Error()).
			WithOperations("getComponentsLatency.Unmarshal")
	}

	var circleComponents []CircleComponentHealthRepresentation
	for _, component := range components {
		query := main.GetAverageHttpErrorsPercentageStringQuery(circleId)
		value, err := main.getResultQuery(query, workspaceID)
		if err != nil {
			return nil, err.WithOperations("getComponentsLatency.getResultQuery")
		}

		circleComponents = append(circleComponents, CircleComponentHealthRepresentation{
			Name:      component.Name,
			Value:     value,
			Threshold: component.LatencyThreshold,
			Status:    main.getComponentStatus(component.LatencyThreshold, value),
		})
	}

	return circleComponents, nil
}

func (main Main) ComponentsHealth(circleIDHeader, circleId string, workspaceID uuid.UUID) (CircleHealthRepresentation, errors.Error) {
	requestTotalQueryString := main.getTotalRequestStringQuery(circleId, true)
	requestsTotal, err := main.getResultQuery(requestTotalQueryString, workspaceID)
	if err != nil {
		return CircleHealthRepresentation{}, err.WithOperations("ComponentsHealth.getResultQuery")
	}

	componentsErrorPercentage, err := main.getComponentsErrorPercentage(circleIDHeader, circleId, workspaceID)
	if err != nil {
		return CircleHealthRepresentation{}, err.WithOperations("ComponentsHealth.getComponentsErrorPercentage")
	}

	componentsErrorLatency, err := main.getComponentsLatency(circleIDHeader, circleId, workspaceID)
	if err != nil {
		return CircleHealthRepresentation{}, err.WithOperations("ComponentsHealth.getComponentsLatency")
	}

	return CircleHealthRepresentation{
		Requests: CircleRequestsRepresentation{requestsTotal, REQUESTS_BY_CIRCLE},
		Errors:   CircleHealthTypeRepresentation{REQUESTS_ERRORS_BY_CIRCLE, componentsErrorPercentage},
		Latency:  CircleHealthTypeRepresentation{REQUESTS_LATENCY_BY_CIRCLE, componentsErrorLatency},
	}, nil
}
