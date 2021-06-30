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
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
)

func MetricsGroupDomainToModel(metricsGroup domain.MetricsGroup) models.MetricsGroup {
	return models.MetricsGroup{
		BaseModel:   metricsGroup.BaseModel,
		Name:        metricsGroup.Name,
		Metrics:     MetricDomainToModels(metricsGroup.Metrics),
		WorkspaceID: metricsGroup.WorkspaceID,
		CircleID:    metricsGroup.CircleID,
		Actions:     MetricsGroupActionDomainToModels(metricsGroup.Actions),
		DeletedAt:   metricsGroup.DeletedAt,
	}
}

func MetricsGroupModelToDomain(metricsGroup models.MetricsGroup) domain.MetricsGroup {
	return domain.MetricsGroup{
		BaseModel:   metricsGroup.BaseModel,
		Name:        metricsGroup.Name,
		Metrics:     MetricModelToDomains(metricsGroup.Metrics),
		WorkspaceID: metricsGroup.WorkspaceID,
		CircleID:    metricsGroup.CircleID,
		Actions:     MetricsGroupActionModelToDomains(metricsGroup.Actions),
		DeletedAt:   metricsGroup.DeletedAt,
	}
}

func MetricGroupResumeModelToDomain(metricsGroupResume models.MetricGroupResume) domain.MetricGroupResume {
	return domain.MetricGroupResume{
		BaseModel:         metricsGroupResume.BaseModel,
		Name:              metricsGroupResume.Name,
		Thresholds:        metricsGroupResume.Thresholds,
		ThresholdsReached: metricsGroupResume.ThresholdsReached,
		Metrics:           metricsGroupResume.Metrics,
		Status:            metricsGroupResume.Status,
	}
}

func MetricValuesToDomain(metricValues datasource.MetricValues) domain.MetricValues {
	return domain.MetricValues{
		ID:       metricValues.ID,
		Nickname: metricValues.Nickname,
		Values:   metricValues.Values,
	}
}

func MetricResultToDomain(metricResult datasource.MetricResult) domain.MetricResult {
	return domain.MetricResult{
		ID:       metricResult.ID,
		Nickname: metricResult.Nickname,
		Result:   metricResult.Result,
	}
}

func MetricsGroupRepresentationModelToDomain(groupRepresentationModel models.MetricsGroupRepresentation) domain.MetricsGroupRepresentation {
	return domain.MetricsGroupRepresentation{
		ID:      groupRepresentationModel.ID,
		Name:    groupRepresentationModel.Name,
		Metrics: MetricModelToDomains(groupRepresentationModel.Metrics),
		Actions: GroupActionExecutionStatusResumeModelToDomains(groupRepresentationModel.Actions),
	}
}

func MetricsGroupModelToDomains(metricsGroup []models.MetricsGroup) []domain.MetricsGroup {
	metricsGroups := make([]domain.MetricsGroup, 0)
	for _, mg := range metricsGroup {
		metricsGroups = append(metricsGroups, MetricsGroupModelToDomain(mg))
	}
	return metricsGroups
}

func MetricGroupResumeModelToDomains(metricsGroup []models.MetricGroupResume) []domain.MetricGroupResume {
	metricsGroups := make([]domain.MetricGroupResume, 0)
	for _, mg := range metricsGroup {
		metricsGroups = append(metricsGroups, MetricGroupResumeModelToDomain(mg))
	}
	return metricsGroups
}

func MetricValuesToDomains(metricValues []datasource.MetricValues) []domain.MetricValues {
	metricsValues := make([]domain.MetricValues, 0)
	for _, mv := range metricValues {
		metricsValues = append(metricsValues, MetricValuesToDomain(mv))
	}
	return metricsValues
}

func MetricResultsToDomains(metricResults []datasource.MetricResult) []domain.MetricResult {
	metricsResults := make([]domain.MetricResult, 0)
	for _, mv := range metricResults {
		metricsResults = append(metricsResults, MetricResultToDomain(mv))
	}
	return metricsResults
}

func MetricsGroupRepresentationModelToDomains(groupRepresentationModel []models.MetricsGroupRepresentation) []domain.MetricsGroupRepresentation {
	groupRepresentationList := make([]domain.MetricsGroupRepresentation, 0)
	for _, mv := range groupRepresentationModel {
		groupRepresentationList = append(groupRepresentationList, MetricsGroupRepresentationModelToDomain(mv))
	}
	return groupRepresentationList
}
