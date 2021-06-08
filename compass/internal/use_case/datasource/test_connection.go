package datasource

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type TestConnection interface {
	Execute(pluginSrc string, datasourceData json.RawMessage) error
}

type testConnection struct {
	datasourceRepository repository.DatasourceRepository
}

func NewTestConnection(d repository.DatasourceRepository) TestConnection {
	return testConnection{
		datasourceRepository: d,
	}
}

func (t testConnection) Execute(pluginSrc string, datasourceData json.RawMessage) error {
	if err := t.datasourceRepository.TestConnection(pluginSrc, datasourceData); err != nil {
		return logging.WithOperation(err, "testConnection.Execute")
	}

	return nil
}
