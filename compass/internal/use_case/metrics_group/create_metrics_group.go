package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type CreateMetricsGroup interface {
	Execute(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
}

type createMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewCreateMetricsGroup(d repository.MetricsGroupRepository) CreateMetricsGroup {
	return createMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s createMetricsGroup) Execute(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.Save(metricsGroup)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "createMetricsGroup.Execute")
	}

	return mg, nil
}
