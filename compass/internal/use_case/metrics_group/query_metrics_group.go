package metrics_group

import (
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
	"net/http"
)

type QueryMetricsGroup interface {
	Execute(id uuid.UUID, periodParameter, intervalParameter string) (domain.MetricsGroup, error)
}

type queryMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewQueryMetricsGroup(d repository.MetricsGroupRepository) QueryMetricsGroup {
	return queryMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s queryMetricsGroup) Execute(id uuid.UUID, periodParameter, intervalParameter string) (domain.MetricsGroup, error) {

	if periodParameter == "" || intervalParameter == "" {
		return domain.MetricsGroup{}, logging.NewError("Period or interval params is required", errors.New("invalid parameters"), nil, "getMetricsGroup.Execute")
	}

	ragePeriod, err := s.metricsGroupRepository.PeriodValidate(periodParameter)
	if err != nil {
		return echoCtx.JSON(http.StatusInternalServerError, err)
	}

	interval, err := s.metricsGroupRepository.PeriodValidate(intervalParameter)
	if err != nil {
		return echoCtx.JSON(http.StatusInternalServerError, err)
	}

	mg, err := s.metricsGroupRepository.QueryByGroupID(id, ragePeriod, interval)
	if err != nil {
		return domain.MetricsGroup{}, logging.WithOperation(err, "getMetricsGroup.Execute")
	}

	return mg, nil
}
