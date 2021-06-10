package metrics_group

import (
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type QueryMetricsGroup interface {
	Execute(id uuid.UUID, periodParameter, intervalParameter string) ([]domain.MetricValues, error)
}

type queryMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewQueryMetricsGroup(d repository.MetricsGroupRepository) QueryMetricsGroup {
	return queryMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s queryMetricsGroup) Execute(id uuid.UUID, periodParameter, intervalParameter string) ([]domain.MetricValues, error) {

	if periodParameter == "" || intervalParameter == "" {
		return []domain.MetricValues{}, logging.NewError("Period or interval params is required", errors.New("invalid parameters"), nil, "queryMetricsGroup.Execute")
	}

	ragePeriod, err := s.metricsGroupRepository.PeriodValidate(periodParameter)
	if err != nil {
		return []domain.MetricValues{}, logging.WithOperation(err, "queryMetricsGroup.Execute.PeriodValidate")
	}

	interval, err := s.metricsGroupRepository.PeriodValidate(intervalParameter)
	if err != nil {
		return []domain.MetricValues{}, logging.WithOperation(err, "queryMetricsGroup.Execute.PeriodValidate")
	}

	query, err := s.metricsGroupRepository.QueryByGroupID(id, ragePeriod, interval)
	if err != nil {
		return []domain.MetricValues{}, logging.WithOperation(err, "queryMetricsGroup.Execute")
	}

	return query, nil
}
