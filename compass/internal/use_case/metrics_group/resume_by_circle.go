package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type ResumeByCircleMetricsGroup interface {
	Execute(circleId uuid.UUID) ([]domain.MetricGroupResume, error)
}

type resumeByCircleMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewResumeByCircleMetricsGroup(d repository.MetricsGroupRepository) ResumeByCircleMetricsGroup {
	return resumeByCircleMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s resumeByCircleMetricsGroup) Execute(circleId uuid.UUID) ([]domain.MetricGroupResume, error) {
	mg, err := s.metricsGroupRepository.ResumeByCircle(circleId)
	if err != nil {
		return []domain.MetricGroupResume{}, logging.WithOperation(err, "resumeByCircleMetricsGroup.Execute")
	}

	return mg, nil
}
