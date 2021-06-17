package metric

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type UpdateMetric interface {
	Execute(metric domain.Metric) (domain.Metric, error)
}

type updateMetric struct {
	metricRepository repository.MetricRepository
}

func NewUpdateMetric(m repository.MetricRepository) UpdateMetric {
	return updateMetric{
		metricRepository: m,
	}
}

func (s updateMetric) Execute(metric domain.Metric) (domain.Metric, error) {
	_, err := s.metricRepository.ResultQuery(metric)
	if err != nil {
		return domain.Metric{}, logging.NewError("Result Query error", err, getFieldValidateByMetric(metric), "updateMetric.Execute")
	}

	mg, err := s.metricRepository.UpdateMetric(metric)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "updateMetric.Execute")
	}

	return mg, nil
}
