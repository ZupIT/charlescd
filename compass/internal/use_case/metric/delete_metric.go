package metric

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteMetric interface {
	Execute(id uuid.UUID) error
}

type deleteMetric struct {
	metricRepository repository.MetricRepository
}

func NewDeleteMetric(m repository.MetricRepository) DeleteMetric {
	return deleteMetric{
		metricRepository: m,
	}
}

func (s deleteMetric) Execute(id uuid.UUID) error {
	err := s.metricRepository.RemoveMetric(id)
	if err != nil {
		return logging.WithOperation(err, "deleteMetric.Execute")
	}

	return nil
}
