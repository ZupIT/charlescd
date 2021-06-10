package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type UpdateMetricsGroup interface {
	Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
}

type updateMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewUpdateMetricsGroup(d repository.MetricsGroupRepository) UpdateMetricsGroup {
	return updateMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s updateMetricsGroup) Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.Update(id, metricsGroup)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "updateMetricsGroup.Execute")
	}

	return mg, nil
}
