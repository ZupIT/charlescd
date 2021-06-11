package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type UpdateNameMetricsGroup interface {
	Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
}

type updateNameMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewUpdateNameMetricsGroup(d repository.MetricsGroupRepository) UpdateNameMetricsGroup {
	return updateNameMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s updateNameMetricsGroup) Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.UpdateName(id, metricsGroup)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "updateMetricsGroup.Execute")
	}

	return mg, nil
}
