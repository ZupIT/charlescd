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

package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func MetricDomainToModel(metric domain.Metric) models.Metric {
	return models.Metric{
		BaseModel:       metric.BaseModel,
		MetricsGroupID:  metric.MetricsGroupID,
		DataSourceID:    metric.DataSourceID,
		Nickname:        metric.Nickname,
		Query:           metric.Query,
		Metric:          metric.Metric,
		Filters:         metric.Filters,
		GroupBy:         MetricGroupByDomainToModels(metric.GroupBy),
		Condition:       metric.Condition,
		Threshold:       metric.Threshold,
		CircleID:        metric.CircleID,
		MetricExecution: MetricExecutionDomainToModel(metric.MetricExecution),
	}
}
func MetricGroupByDomainToModel(metricGroupBy domain.MetricGroupBy) models.MetricGroupBy {
	return models.MetricGroupBy{
		BaseModel: metricGroupBy.BaseModel,
		MetricID:  metricGroupBy.MetricID,
		Field:     metricGroupBy.Field,
	}
}

func MetricModelToDomain(metric models.Metric) domain.Metric {
	return domain.Metric{
		BaseModel:       metric.BaseModel,
		MetricsGroupID:  metric.MetricsGroupID,
		DataSourceID:    metric.DataSourceID,
		Nickname:        metric.Nickname,
		Query:           metric.Query,
		Metric:          metric.Metric,
		Filters:         metric.Filters,
		GroupBy:         MetricGroupByModelToDomains(metric.GroupBy),
		Condition:       metric.Condition,
		Threshold:       metric.Threshold,
		CircleID:        metric.CircleID,
		MetricExecution: MetricExecutionModelToDomain(metric.MetricExecution),
	}
}

func MetricGroupByModelToDomain(metricGroupBy models.MetricGroupBy) domain.MetricGroupBy {
	return domain.MetricGroupBy{
		BaseModel: metricGroupBy.BaseModel,
		MetricID:  metricGroupBy.MetricID,
		Field:     metricGroupBy.Field,
	}
}

func MetricDomainToModels(metrics []domain.Metric) []models.Metric {
	metricsList := make([]models.Metric, 0)
	for _, mg := range metrics {
		metricsList = append(metricsList, MetricDomainToModel(mg))
	}
	return metricsList
}

func MetricModelToDomains(metrics []models.Metric) []domain.Metric {
	metricsList := make([]domain.Metric, 0)
	for _, mg := range metrics {
		metricsList = append(metricsList, MetricModelToDomain(mg))
	}
	return metricsList
}

func MetricGroupByDomainToModels(groupBies []domain.MetricGroupBy) []models.MetricGroupBy {
	metricGroupBies := make([]models.MetricGroupBy, 0)
	for _, mg := range groupBies {
		metricGroupBies = append(metricGroupBies, MetricGroupByDomainToModel(mg))
	}
	return metricGroupBies
}

func MetricGroupByModelToDomains(groupBies []models.MetricGroupBy) []domain.MetricGroupBy {
	metricGroupBies := make([]domain.MetricGroupBy, 0)
	for _, mg := range groupBies {
		metricGroupBies = append(metricGroupBies, MetricGroupByModelToDomain(mg))
	}
	return metricGroupBies
}
