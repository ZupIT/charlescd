package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type ListMetricGroupByCircle interface {
	Execute(circleId uuid.UUID) ([]domain.MetricsGroupRepresentation, error)
}

type listMetricGroupByCircle struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewListMetricGroupByCircle(d repository.MetricsGroupRepository) ListMetricGroupByCircle {
	return listMetricGroupByCircle{
		metricsGroupRepository: d,
	}
}

func (s listMetricGroupByCircle) Execute(circleId uuid.UUID) ([]domain.MetricsGroupRepresentation, error) {
	mg, err := s.metricsGroupRepository.ListAllByCircle(circleId)
	if err != nil {
		return []domain.MetricsGroupRepresentation{}, logging.WithOperation(err, "listMetricGroupByCircle.Execute")
	}

	return mg, nil
}
