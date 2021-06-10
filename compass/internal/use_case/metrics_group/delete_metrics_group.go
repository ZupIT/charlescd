package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteMetricsGroup interface {
	Execute(id uuid.UUID) error
}

type deleteMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewDeleteMetricsGroup(d repository.MetricsGroupRepository) DeleteMetricsGroup {
	return deleteMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s deleteMetricsGroup) Execute(id uuid.UUID) error {
	err := s.metricsGroupRepository.Remove(id)
	if err != nil {
		return logging.WithOperation(err, "deleteMetricsGroup.Execute")
	}

	return nil
}
