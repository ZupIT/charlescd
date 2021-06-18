package metrics_group_action

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type FindMetricsGroupActionById interface {
	Execute(id uuid.UUID) (domain.MetricsGroupAction, error)
}

type findMetricsGroupActionById struct {
	metricsGroupActionRepository repository.MetricsGroupActionRepository
	actionRepository             repository.ActionRepository
	pluginRepository             repository.PluginRepository
}

func NewFindMetricsGroupActionById(m repository.MetricsGroupActionRepository) FindMetricsGroupActionById {
	return findMetricsGroupActionById{
		metricsGroupActionRepository: m,
	}
}

func (s findMetricsGroupActionById) Execute(id uuid.UUID) (domain.MetricsGroupAction, error) {
	act, err := s.metricsGroupActionRepository.FindGroupActionById(id)
	if err != nil {
		return domain.MetricsGroupAction{}, logging.WithOperation(err, "findMetricsGroupActionById.Execute")
	}

	return act, nil
}
