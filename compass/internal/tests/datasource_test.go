package tests

import (
	"compass/internal/configuration"
	datasource2 "compass/internal/datasource"
	"compass/internal/plugin"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"io/ioutil"
	"os"
	"strings"
	"testing"
)

type Suite struct {
	suite.Suite
	DB *gorm.DB

	repository datasource2.UseCases
	datasource *datasource2.DataSource
}

func (s *Suite) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *Suite) BeforeTest(suiteName, testName string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	var pluginMain = plugin.NewMain()
	s.repository = datasource2.NewMain(s.DB, pluginMain)
	s.DB.Exec("DELETE FROM data_sources")
}

func (s *Suite) AfterTest(suiteName, testName string) {
	s.DB.Close()
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestParse() {
	stringReader := strings.NewReader(`{ "name": "Prometheus do maycao", "pluginId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7", "health": true, "data": { "url": "http://35.238.107.172:9090" } }`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.Parse(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *Suite) TestParseError() {
	stringReader := strings.NewReader(`{ "name": "Prometheus do maycao", "pluginfasdf": "4*bd" `)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *Suite) TestValidate() {
	datasource := datasource2.DataSource{}
	var errList = s.repository.Validate(datasource)

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestValidateNameLength() {
	datasource := datasource2.DataSource{
		Name:      BigString,
		PluginSrc: BigString,
	}
	var errList = s.repository.Validate(datasource)

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestFindById() {
	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSourceStruct)
	res, err := s.repository.FindById(dataSourceStruct.ID.String())

	require.NoError(s.T(), err)

	dataSourceStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), dataSourceStruct, res)
}

func (s *Suite) TestFindAllByWorkspace() {
	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}
	s.DB.Create(&dataSourceStruct)

	res, err := s.repository.FindAllByWorkspace(dataSourceStruct.WorkspaceID.String(), "true")

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
	require.Equal(s.T(), true, res[0].Health)
}

func (s *Suite) TestFindAllByWorkspaceError() {
	s.DB.Close()
	_, err := s.repository.FindAllByWorkspace(uuid.New().String(), "true")

	require.Error(s.T(), err)
}

func (s *Suite) TestFindAllByWorkspaceWithHealth() {
	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      false,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}
	s.DB.Create(&dataSourceStruct)

	res, err := s.repository.FindAllByWorkspace(dataSourceStruct.WorkspaceID.String(), "")

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
	require.Equal(s.T(), false, res[0].Health)
}

func (s *Suite) TestSaveDatasource() {
	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	res, err := s.repository.Save(dataSourceStruct)

	require.NoError(s.T(), err)

	dataSourceStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), dataSourceStruct, res)
}

func (s *Suite) TestSaveDatasourceError() {
	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	s.DB.Close()
	_, err := s.repository.Save(dataSourceStruct)
	require.Error(s.T(), err)
}

func (s *Suite) TestSaveDatasourceWithHealthInserted() {
	workspaceId := uuid.New()
	dataSource := datasource2.DataSource{
		Name:        "DataTest2",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)

	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	_, err := s.repository.Save(dataSourceStruct)
	require.Error(s.T(), err)
}

func (s *Suite) TestDelete() {
	workspaceId := uuid.New()
	dataSource := datasource2.DataSource{
		Name:        "DataTest2",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)

	err := s.repository.Delete(dataSource.ID.String())
	require.NoError(s.T(), err)
}

func (s *Suite) TestFindByIdNotFoundError() {
	_, err := s.repository.FindById("any-id")
	require.Error(s.T(), err)
}

func (s *Suite) TestDeleteError() {
	s.DB.Close()
	err := s.repository.Delete("any-id")
	require.Error(s.T(), err)
}
