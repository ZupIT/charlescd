package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type ResultMetrics interface {
	Execute(id uuid.UUID) ([]domain.MetricResult, error)
}

type resultMetrics struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewResultMetrics(d repository.MetricsGroupRepository) ResultMetrics {
	return resultMetrics{
		metricsGroupRepository: d,
	}
}

func (s resultMetrics) Execute(id uuid.UUID) ([]domain.MetricResult, error) {
	queryResult, err := s.metricsGroupRepository.ResultByID(id)
	if err != nil {
		return []domain.MetricResult{}, logging.WithOperation(err, "resultMetrics.Execute")
	}

	return queryResult, nil
}
