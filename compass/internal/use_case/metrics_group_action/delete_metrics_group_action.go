package metrics_group_action

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteMetricsGroupAction interface {
	Execute(id uuid.UUID) error
}

type deleteMetricsGroupAction struct {
	metricsGroupActionRepository repository.MetricsGroupActionRepository
}

func NewDeleteMetricsGroupAction(m repository.MetricsGroupActionRepository) DeleteMetricsGroupAction {
	return deleteMetricsGroupAction{
		metricsGroupActionRepository: m,
	}
}

func (s deleteMetricsGroupAction) Execute(id uuid.UUID) error {
	err := s.metricsGroupActionRepository.DeleteGroupAction(id)
	if err != nil {
		return logging.WithOperation(err, "deleteMetricsGroupAction.Execute")
	}

	return nil
}
