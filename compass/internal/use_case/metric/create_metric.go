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
	metricRepository       repository.MetricRepository
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewCreateMetric(m repository.MetricRepository, mg repository.MetricsGroupRepository) CreateMetric {
	return createMetrics{
		metricRepository:       m,
		metricsGroupRepository: mg,
	}
}

func (s createMetrics) Execute(metric domain.Metric) (domain.Metric, error) {
	metricGroup, err := s.metricsGroupRepository.FindById(metric.MetricsGroupID)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "createMetric.Execute")
	}

	metric.CircleID = metricGroup.CircleID

	_, err = s.metricRepository.ResultQuery(metric)
	if err != nil {
		return domain.Metric{}, logging.NewError("Result Query error", err, getFieldValidateByMetric(metric), "createMetric.Execute")
	}

	mg, err := s.metricRepository.SaveMetric(metric)
	if err != nil {
		return domain.Metric{}, logging.WithOperation(err, "createMetric.Execute")
	}

	return mg, nil
}

func getFieldValidateByMetric(metric domain.Metric) map[string]string {
	field := "metric"
	if metric.Query != "" {
		field = "query"
	}

	return map[string]string{"field": field}
}
