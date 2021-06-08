package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

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

func MetricsGroupModelToDomains(metricsGroup []models.MetricsGroup) []domain.MetricsGroup {
	metricsGroups := make([]domain.MetricsGroup, 0)
	for _, mg := range metricsGroup {
		metricsGroups = append(metricsGroups, MetricsGroupModelToDomain(mg))
	}
	return metricsGroups
}
