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
	var err error

	os.Setenv("ENV", "TEST")

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	var pluginMain = plugin.NewMain()

	s.repository = datasource2.NewMain(s.DB, pluginMain)
}

func (s *Suite) BeforeTest(suiteName, testName string) {
	s.DB.Exec("DELETE FROM data_sources")
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
	err := s.repository.Delete("any-id")
	require.Error(s.T(), err)
}

//func (s *Suite) TestGetMetrics() {
//	os.Setenv("PLUGINS_DIR", "../../plugins")
//	dataSource := datasource2.DataSource{
//		Name:        "DataTest2",
//		PluginSrc:   "prometheus",
//		Health:      true,
//		Data:        json.RawMessage(`{"url": "http://localhost:9090"}`),
//		WorkspaceID: uuid.New(),
//		DeletedAt:   nil,
//	}
//
//	s.DB.Create(&dataSource)
//
//
//	metrics, err := s.repository.GetMetrics(dataSource.ID.String(), "")
//	require.NoError(s.T(), err)
//
//	require.Equal(s.T(), []string{
//		"scrape_duration_seconds",
//		"scrape_samples_post_metric_relabeling",
//		"scrape_samples_scraped",
//		"scrape_series_added",
//		"up",
//	}, metrics)
//}

//
//func (s *Suite) TestFindAllByWorkspace() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = false
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	rows := sqlmock.
//		NewRows([]string{"id", "created_at", "name", "plugin_src", "health", "data", "workspace_id"}).
//		AddRow(id, timeNow, name, pluginSrc, health, data, workspaceID)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectQuery(regexp.QuoteMeta(
//		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((workspace_id = $1))`)).
//		WithArgs(workspaceID).
//		WillReturnRows(rows)
//
//	res, err := s.repository.FindAllByWorkspace(workspaceID.String(), "")
//
//	expected := DataSource{
//		BaseModel:   baseModel,
//		Name:        name,
//		PluginSrc:   pluginSrc,
//		Health:      health,
//		Data:        data,
//		WorkspaceID: workspaceID,
//		DeletedAt:   nil,
//	}
//
//	require.NoError(s.T(), err)
//	require.Contains(s.T(), res, expected)
//}
//
//func (s *Suite) TestFindAllByWorkspaceWithHealthTrue() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = true
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	rows := sqlmock.
//		NewRows([]string{"id", "created_at", "name", "plugin_src", "health", "data", "workspace_id"}).
//		AddRow(id, timeNow, name, pluginSrc, health, data, workspaceID)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectQuery(regexp.QuoteMeta(
//		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((workspace_id = $1 AND health = $2))`)).
//		WithArgs(workspaceID, health).
//		WillReturnRows(rows)
//
//	res, err := s.repository.FindAllByWorkspace(workspaceID.String(), "true")
//
//	expected := DataSource{
//		BaseModel:   baseModel,
//		Name:        name,
//		PluginSrc:   pluginSrc,
//		Health:      health,
//		Data:        data,
//		WorkspaceID: workspaceID,
//		DeletedAt:   nil,
//	}
//
//	require.NoError(s.T(), err)
//	require.Contains(s.T(), res, expected)
//}
//
//func (s *Suite) TestFindAllByWorkspaceError() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = false
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	rows := sqlmock.
//		NewRows([]string{"id", "created_at", "name", "plugin_src", "health", "data", "workspace_id"}).
//		AddRow(id, timeNow, name, pluginSrc, health, data, workspaceID)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectQuery(regexp.QuoteMeta(
//		`SELECT * FROM "ERROR" WHERE "data_sources"."deleted_at" IS NULL AND ((workspace_id = $1))`)).
//		WithArgs(workspaceID).
//		WillReturnRows(rows)
//
//	_, err := s.repository.FindAllByWorkspace(workspaceID.String(), "")
//
//	require.Error(s.T(), err)
//}
//
//func (s *Suite) TestDelete() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = true
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	rows := sqlmock.
//		NewRows([]string{"id", "created_at", "name", "plugin_src", "health", "data", "workspace_id"}).
//		AddRow(id, timeNow, name, pluginSrc, health, data, workspaceID)
//
//	s.mock.ExpectQuery(regexp.QuoteMeta(
//		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
//		WithArgs(id).
//		WillReturnRows(rows)
//
//	s.mock.ExpectBegin()
//	s.mock.ExpectExec(regexp.QuoteMeta(
//		`UPDATE "data_sources"`)).WillReturnResult(sqlmock.NewResult(1, 1))
//	s.mock.ExpectCommit()
//
//	res := s.repository.Delete(id.String())
//
//	require.Nil(s.T(), res)
//}
//
//func (s *Suite) TestDeleteError() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = true
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	rows := sqlmock.
//		NewRows([]string{"id", "created_at", "name", "plugin_src", "health", "data", "workspace_id"}).
//		AddRow(id, timeNow, name, pluginSrc, health, data, workspaceID)
//
//	s.mock.ExpectQuery(regexp.QuoteMeta(
//		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
//		WithArgs(id).
//		WillReturnRows(rows)
//
//	s.mock.ExpectBegin()
//	s.mock.ExpectExec(regexp.QuoteMeta(
//		`UPDATE "ERROR"`)).WillReturnResult(sqlmock.NewResult(1, 1))
//	s.mock.ExpectCommit()
//
//	err := s.repository.Delete(id.String())
//
//	require.Error(s.T(), err)
//}
//
//func (s *Suite) TestDeleteFindError() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = true
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	rows := sqlmock.
//		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
//		AddRow(id, timeNow, name, pluginSrc, health, data, workspaceID)
//
//	s.mock.ExpectQuery(regexp.QuoteMeta(
//		`SELECT * FROM "ERROR" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
//		WithArgs(id).
//		WillReturnRows(rows)
//
//	s.mock.ExpectBegin()
//	s.mock.ExpectExec(regexp.QuoteMeta(
//		`UPDATE "ERROR"`)).WillReturnResult(sqlmock.NewResult(1, 1))
//	s.mock.ExpectCommit()
//
//	err := s.repository.Delete(id.String())
//
//	require.Error(s.T(), err)
//}
//
//func (s *Suite) TestSave() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = false
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	expected := DataSource{
//		BaseModel:   baseModel,
//		Name:        name,
//		PluginSrc:   pluginSrc,
//		Health:      health,
//		Data:        data,
//		WorkspaceID: workspaceID,
//		DeletedAt:   nil,
//	}
//
//	query := regexp.QuoteMeta(`INSERT INTO "data_sources"`)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectBegin()
//	s.mock.ExpectQuery(query).
//		WithArgs(sqlmock.AnyArg(), timeNow, name, pluginSrc, health, data, workspaceID.String(), nil).
//		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
//	s.mock.ExpectCommit()
//
//	res, err := s.repository.Save(expected)
//
//	require.NoError(s.T(), err)
//	require.Equal(s.T(), expected, res)
//}
//
//func (s *Suite) TestSaveError() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = false
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	expected := DataSource{
//		BaseModel:   baseModel,
//		Name:        name,
//		PluginSrc:   pluginSrc,
//		Health:      health,
//		Data:        data,
//		WorkspaceID: workspaceID,
//		DeletedAt:   nil,
//	}
//
//	query := regexp.QuoteMeta(`INSERT INTO "plugins"`)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectBegin()
//	s.mock.ExpectQuery(query).
//		WithArgs(sqlmock.AnyArg(), timeNow, name, pluginSrc, health, data, workspaceID.String(), nil).
//		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
//	s.mock.ExpectCommit()
//
//	_, err := s.repository.Save(expected)
//
//	require.Error(s.T(), err)
//}
//
//func (s *Suite) TestSaveErrorWithHealth() {
//	var id = uuid.New()
//	var timeNow = time.Now()
//	var (
//		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
//		name        = "test-name"
//		pluginSrc   = "fake_plugin"
//		health      = true
//		data        = json.RawMessage(`{"url": "localhost:8080"}`)
//		workspaceID = uuid.New()
//	)
//
//	expected := DataSource{
//		BaseModel:   baseModel,
//		Name:        name,
//		PluginSrc:   pluginSrc,
//		Health:      health,
//		Data:        data,
//		WorkspaceID: workspaceID,
//		DeletedAt:   nil,
//	}
//
//	query := regexp.QuoteMeta(`INSERT INTO "plugins"`)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectBegin()
//	s.mock.ExpectQuery(query).
//		WithArgs(sqlmock.AnyArg(), timeNow, name, pluginSrc, health, data, workspaceID.String(), nil).
//		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
//	s.mock.ExpectCommit()
//
//	_, err := s.repository.Save(expected)
//
//	require.Error(s.T(), err)
//}
