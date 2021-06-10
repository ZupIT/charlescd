package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type GetMetricsGroup interface {
	Execute(id uuid.UUID) (domain.MetricsGroup, error)
}

type getMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewGetMetricsGroup(d repository.MetricsGroupRepository) GetMetricsGroup {
	return getMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s getMetricsGroup) Execute(id uuid.UUID) (domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.FindById(id)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "getMetricsGroup.Execute")
	}

	return mg, nil
}
