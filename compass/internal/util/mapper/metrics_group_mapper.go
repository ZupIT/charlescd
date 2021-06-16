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
		Actions:     metricsGroup.Actions,
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
		Actions:     metricsGroup.Actions,
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
