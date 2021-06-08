package metrics_group

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type FindAllMetricsGroup interface {
	Execute(workspaceId uuid.UUID) ([]domain.MetricsGroup, error)
}

type findAllMetricsGroup struct {
	metricsGroupRepository repository.MetricsGroupRepository
}

func NewFindAllMetricsGroup(d repository.MetricsGroupRepository) FindAllMetricsGroup {
	return findAllMetricsGroup{
		metricsGroupRepository: d,
	}
}

func (s findAllMetricsGroup) Execute(workspaceId uuid.UUID) ([]domain.MetricsGroup, error) {
	mg, err := s.metricsGroupRepository.FindAllByWorkspaceId(workspaceId)
	if err != nil {
		return []domain.MetricsGroup{}, logging.WithOperation(err, "findAllMetricsGroup.Execute")
	}

	return mg, nil
}
