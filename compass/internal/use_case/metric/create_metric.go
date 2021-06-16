package metric

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type CreateMetric interface {
	Execute(metricsGroup domain.Metric) (domain.Metric, error)
}

type createMetrics struct {
	metricRepository repository.MetricRepository
}

func NewCreateMetricsGroup(d repository.MetricRepository) CreateMetric {
	return createMetrics{
		metricRepository: d,
	}
}

func (s createMetrics) Execute(metric domain.Metric) (domain.Metric, error) {
	mg, err := s.metricRepository.SaveMetric(metric)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "createMetric.Execute")
	}

	return mg, nil
}
