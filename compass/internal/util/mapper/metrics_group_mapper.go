package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func MetricsGroupDomainToModel(metricsGroup domain.MetricsGroup) models.MetricsGroup {
	return models.MetricsGroup{
		BaseModel:   metricsGroup.BaseModel,
		Name:        metricsGroup.Name,
		Metrics:     metricsGroup.Metrics,
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
		Metrics:     metricsGroup.Metrics,
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
