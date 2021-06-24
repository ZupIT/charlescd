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

package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
)

type MetricRequest struct {
	MetricsGroupID  uuid.UUID              `json:"metricGroupId"`
	DataSourceID    uuid.UUID              `json:"dataSourceId"`
	Nickname        string                 `json:"nickname" validate:"notblank,max=64"`
	Query           string                 `json:"query" validate:"required_without=Metric"`
	Metric          string                 `json:"metric" validate:"required_without=Query,max=64"`
	Filters         []MetricFilterRequest  `json:"filters"`
	GroupBy         []MetricGroupByRequest `json:"groupBy"`
	Condition       string                 `json:"condition"`
	Threshold       float64                `json:"threshold"`
	CircleID        uuid.UUID              `json:"circleId"`
	MetricExecution MetricExecutionRequest `json:"execution"`
}

type MetricFilterRequest struct {
	Field    string `json:"field" validate:"max=100"`
	Value    string `json:"value" validate:"max=100"`
	Operator string `json:"operator"`
}

type MetricGroupByRequest struct {
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field" validate:"max=100"`
}

type MetricResponse struct {
	util.BaseModel
	MetricsGroupID  uuid.UUID               `json:"metricGroupId"`
	DataSourceID    uuid.UUID               `json:"dataSourceId"`
	Nickname        string                  `json:"nickname"`
	Query           string                  `json:"query"`
	Metric          string                  `json:"metric"`
	Filters         []MetricFilterResponse  `json:"filters"`
	GroupBy         []MetricGroupByResponse `json:"groupBy"`
	Condition       string                  `json:"condition"`
	Threshold       float64                 `json:"threshold"`
	CircleID        uuid.UUID               `json:"circleId"`
	MetricExecution MetricExecutionResponse `json:"execution"`
}

type MetricFilterResponse struct {
	Field    string `json:"field"`
	Value    string `json:"value"`
	Operator string `json:"operator"`
}

type MetricGroupByResponse struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field" validate:"max=100"`
}

func (metricRequest MetricRequest) MetricRequestToDomain(metricsGroupId uuid.UUID) domain.Metric {
	return domain.Metric{
		MetricsGroupID:  metricsGroupId,
		DataSourceID:    metricRequest.DataSourceID,
		Nickname:        metricRequest.Nickname,
		Query:           metricRequest.Query,
		Metric:          metricRequest.Metric,
		Filters:         MetricFilterRequestToDomains(metricRequest.Filters),
		GroupBy:         MetricGroupByRequestToDomains(metricRequest.GroupBy),
		Condition:       metricRequest.Condition,
		Threshold:       metricRequest.Threshold,
		CircleID:        metricRequest.CircleID,
		MetricExecution: metricRequest.MetricExecution.MetricExecutionRequestToDomain(),
	}
}

func (metricRequest MetricRequest) MetricUpdateRequestToDomain(id, metricsGroupId uuid.UUID) domain.Metric {
	return domain.Metric{
		BaseModel:       util.BaseModel{ID: id},
		MetricsGroupID:  metricsGroupId,
		DataSourceID:    metricRequest.DataSourceID,
		Nickname:        metricRequest.Nickname,
		Query:           metricRequest.Query,
		Metric:          metricRequest.Metric,
		Filters:         MetricFilterRequestToDomains(metricRequest.Filters),
		GroupBy:         MetricGroupByRequestToDomains(metricRequest.GroupBy),
		Condition:       metricRequest.Condition,
		Threshold:       metricRequest.Threshold,
		CircleID:        metricRequest.CircleID,
		MetricExecution: metricRequest.MetricExecution.MetricExecutionRequestToDomain(),
	}
}

func MetricDomainToResponse(metric domain.Metric) MetricResponse {
	return MetricResponse{
		BaseModel:       metric.BaseModel,
		MetricsGroupID:  metric.MetricsGroupID,
		DataSourceID:    metric.DataSourceID,
		Nickname:        metric.Nickname,
		Query:           metric.Query,
		Metric:          metric.Metric,
		Filters:         MetricFilterDomainToResponses(metric.Filters),
		GroupBy:         MetricGroupByDomainToResponses(metric.GroupBy),
		Condition:       metric.Condition,
		Threshold:       metric.Threshold,
		CircleID:        metric.CircleID,
		MetricExecution: MetricExecutionDomainToResponse(metric.MetricExecution),
	}
}

func MetricFiltersDomainToResponse(metricFilter datasourcePKG.MetricFilter) MetricFilterResponse {
	return MetricFilterResponse{
		Field:    metricFilter.Field,
		Value:    metricFilter.Value,
		Operator: metricFilter.Operator,
	}
}

func MetricGroupByDomainToResponse(metricGroupBy domain.MetricGroupBy) MetricGroupByResponse {
	return MetricGroupByResponse{
		BaseModel: metricGroupBy.BaseModel,
		MetricID:  metricGroupBy.MetricID,
		Field:     metricGroupBy.Field,
	}
}

func (metricGroupByRequest MetricGroupByRequest) MetricGroupByRequestToDomain() domain.MetricGroupBy {
	return domain.MetricGroupBy{
		MetricID: metricGroupByRequest.MetricID,
		Field:    metricGroupByRequest.Field,
	}
}

func (metricFilterRequest MetricFilterRequest) MetricFilterRequestToDomain() datasourcePKG.MetricFilter {
	return datasourcePKG.MetricFilter{
		Field:    metricFilterRequest.Field,
		Value:    metricFilterRequest.Value,
		Operator: metricFilterRequest.Operator,
	}
}

func MetricGroupByRequestToDomains(metricGroupBies []MetricGroupByRequest) []domain.MetricGroupBy {
	var metricGroupByList []domain.MetricGroupBy
	for _, metricGroupBy := range metricGroupBies {
		metricGroupByList = append(metricGroupByList, metricGroupBy.MetricGroupByRequestToDomain())
	}
	return metricGroupByList
}

func MetricFilterRequestToDomains(metricFilters []MetricFilterRequest) []datasourcePKG.MetricFilter {
	var metricFilterList []datasourcePKG.MetricFilter
	for _, metricFilter := range metricFilters {
		metricFilterList = append(metricFilterList, metricFilter.MetricFilterRequestToDomain())
	}
	return metricFilterList
}

func MetricDomainToResponses(metrics []domain.Metric) []MetricResponse {
	var metricList []MetricResponse
	for _, metricFilter := range metrics {
		metricList = append(metricList, MetricDomainToResponse(metricFilter))
	}
	return metricList
}

func MetricFilterDomainToResponses(metricFilters []datasourcePKG.MetricFilter) []MetricFilterResponse {
	var metricFilterList []MetricFilterResponse
	for _, metricFilter := range metricFilters {
		metricFilterList = append(metricFilterList, MetricFiltersDomainToResponse(metricFilter))
	}
	return metricFilterList
}

func MetricGroupByDomainToResponses(metricGroupBies []domain.MetricGroupBy) []MetricGroupByResponse {
	var metricGroupByList []MetricGroupByResponse
	for _, metricGroupBy := range metricGroupBies {
		metricGroupByList = append(metricGroupByList, MetricGroupByDomainToResponse(metricGroupBy))
	}
	return metricGroupByList
}
