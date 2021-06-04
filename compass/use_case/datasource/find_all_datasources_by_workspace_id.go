package datasource

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type FindAllDatasource interface {
	Execute(workspaceId uuid.UUID) ([]domain.Datasource, error)
}

type findAllDatasource struct {
	datasourceRepository repository.DatasourceRepository
}

func NewFindAllDatasource(d repository.DatasourceRepository) FindAllDatasource {
	return findAllDatasource{
		datasourceRepository: d,
	}
}

func (s findAllDatasource) Execute(workspaceId uuid.UUID) ([]domain.Datasource, error) {
	datasources, err := s.datasourceRepository.FindAllByWorkspace(workspaceId)
	if err != nil {
		return []domain.Datasource{}, logging.WithOperation(err, "saveDatasource.Execute")
	}

	return datasources, nil
}
