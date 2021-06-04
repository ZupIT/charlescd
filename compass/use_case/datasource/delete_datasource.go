package datasource

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteDatasource interface {
	Execute(id uuid.UUID) error
}

type deleteDatasource struct {
	datasourceRepository repository.DatasourceRepository
}

func NewDeleteDatasource(d repository.DatasourceRepository) DeleteDatasource {
	return deleteDatasource{
		datasourceRepository: d,
	}
}

func (s deleteDatasource) Execute(id uuid.UUID) error {
	err := s.datasourceRepository.Delete(id)
	if err != nil {
		return logging.WithOperation(err, "deleteDatasource.Execute")
	}

	return nil
}
