package datasource

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type SaveDatasource interface {
	Execute(datasource domain.Datasource) (domain.Datasource, error)
}

type saveDatasource struct {
	datasourceRepository repository.DatasourceRepository
}

func NewDatasource(d repository.DatasourceRepository) SaveDatasource {
	return saveDatasource{
		datasourceRepository: d,
	}
}

func (s saveDatasource) Execute(datasource domain.Datasource) (domain.Datasource, error) {
	savedDatasource, err := s.datasourceRepository.Save(datasource)
	if err != nil {
		return domain.Datasource{}, logging.WithOperation(err, "saveDatasource.Execute")
	}

	return savedDatasource, nil
}
