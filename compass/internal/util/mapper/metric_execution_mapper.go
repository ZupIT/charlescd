package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func MetricExecutionDomainToModel(metricExecution domain.MetricExecution) models.MetricExecution {
	return models.MetricExecution{
		BaseModel: metricExecution.BaseModel,
		MetricID:  metricExecution.MetricID,
		LastValue: metricExecution.LastValue,
		Status:    metricExecution.Status,
	}
}

func MetricExecutionModelToDomain(metricExecution models.MetricExecution) domain.MetricExecution {
	return domain.MetricExecution{
		BaseModel: metricExecution.BaseModel,
		MetricID:  metricExecution.MetricID,
		LastValue: metricExecution.LastValue,
		Status:    metricExecution.Status,
	}
}

func MetricExecutionModelToDomains(metricExecution []models.MetricExecution) []domain.MetricExecution {
	metricExecutionList := make([]domain.MetricExecution, 0)
	for _, mg := range metricExecution {
		metricExecutionList = append(metricExecutionList, MetricExecutionModelToDomain(mg))
	}
	return metricExecutionList
}
