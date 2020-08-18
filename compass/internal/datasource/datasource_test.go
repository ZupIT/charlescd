package datasource

import (
	"compass/internal/plugin"
	"compass/internal/util"
	"compass/pkg/logger/fake"
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"regexp"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type Suite struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository UseCases
	datasource *DataSource
}

func (s *Suite) SetupSuite() {
	var (
		db  *sql.DB
		err error
	)

	db, s.mock, err = sqlmock.New()
	require.NoError(s.T(), err)

	s.DB, err = gorm.Open("postgres", db)
	require.NoError(s.T(), err)

	s.DB.LogMode(true)

	fakeLogger := fake.NewLoggerFake()
	var pluginMain = plugin.NewMain(s.DB, fakeLogger)

	s.repository = NewMain(s.DB, pluginMain, fakeLogger)
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
	stringReader := strings.NewReader(`{ "name": "Prometheus do maycao", "pluginId": "4bd" }`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *Suite) TestValidate() {
	datasource := DataSource{}
	var errList = datasource.Validate()

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestFindById() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
		WithArgs(id).
		WillReturnRows(rows)

	res, err := s.repository.FindById(id.String())

	expected := DataSource{
		BaseModel:   baseModel,
		Name:        name,
		PluginID:    pluginID,
		Health:      health,
		Data:        data,
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}

	require.NoError(s.T(), err)
	require.Equal(s.T(), expected, res)
}

func (s *Suite) TestFindByIdWithError() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
		WithArgs("123456789").
		WillReturnRows(rows)

	_, err := s.repository.FindById(id.String())

	require.Error(s.T(), err)
}

func (s *Suite) TestFindAllByWorkspace() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((workspace_id = $1))`)).
		WithArgs(workspaceID).
		WillReturnRows(rows)

	res, err := s.repository.FindAllByWorkspace(workspaceID.String(), "")

	expected := DataSource{
		BaseModel:   baseModel,
		Name:        name,
		PluginID:    pluginID,
		Health:      health,
		Data:        data,
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}

	require.NoError(s.T(), err)
	require.Contains(s.T(), res, expected)
}

func (s *Suite) TestFindAllByWorkspaceWithHealthTrue() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = true
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((workspace_id = $1 AND health = $2))`)).
		WithArgs(workspaceID, health).
		WillReturnRows(rows)

	res, err := s.repository.FindAllByWorkspace(workspaceID.String(), "true")

	expected := DataSource{
		BaseModel:   baseModel,
		Name:        name,
		PluginID:    pluginID,
		Health:      health,
		Data:        data,
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}

	require.NoError(s.T(), err)
	require.Contains(s.T(), res, expected)
}

func (s *Suite) TestFindAllByWorkspaceError() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "ERROR" WHERE "data_sources"."deleted_at" IS NULL AND ((workspace_id = $1))`)).
		WithArgs(workspaceID).
		WillReturnRows(rows)

	_, err := s.repository.FindAllByWorkspace(workspaceID.String(), "")

	require.Error(s.T(), err)
}

func (s *Suite) TestDelete() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		name        = "test-name"
		pluginID    = uuid.New()
		health      = true
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
		WithArgs(id).
		WillReturnRows(rows)

	s.mock.ExpectBegin()
	s.mock.ExpectExec(regexp.QuoteMeta(
		`UPDATE "data_sources"`)).WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	res := s.repository.Delete(id.String())

	require.Nil(s.T(), res)
}

func (s *Suite) TestDeleteError() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		name        = "test-name"
		pluginID    = uuid.New()
		health      = true
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "data_sources" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
		WithArgs(id).
		WillReturnRows(rows)

	s.mock.ExpectBegin()
	s.mock.ExpectExec(regexp.QuoteMeta(
		`UPDATE "ERROR"`)).WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	err := s.repository.Delete(id.String())

	require.Error(s.T(), err)
}

func (s *Suite) TestDeleteFindError() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		name        = "test-name"
		pluginID    = uuid.New()
		health      = true
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	rows := sqlmock.
		NewRows([]string{"id", "created_at", "name", "plugin_id", "health", "data", "workspace_id"}).
		AddRow(id, timeNow, name, pluginID, health, data, workspaceID)

	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "ERROR" WHERE "data_sources"."deleted_at" IS NULL AND ((id = $1)) ORDER BY "data_sources"."id" ASC LIMIT 1`)).
		WithArgs(id).
		WillReturnRows(rows)

	s.mock.ExpectBegin()
	s.mock.ExpectExec(regexp.QuoteMeta(
		`UPDATE "ERROR"`)).WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	err := s.repository.Delete(id.String())

	require.Error(s.T(), err)
}

func (s *Suite) TestSave() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	expected := DataSource{
		BaseModel:   baseModel,
		Name:        name,
		PluginID:    pluginID,
		Health:      health,
		Data:        data,
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}

	query := regexp.QuoteMeta(`INSERT INTO "data_sources"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(query).
		WithArgs(sqlmock.AnyArg(), timeNow, name, pluginID.String(), health, data, workspaceID.String(), nil).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	res, err := s.repository.Save(expected)

	require.NoError(s.T(), err)
	require.Equal(s.T(), expected, res)
}

func (s *Suite) TestSaveError() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	expected := DataSource{
		BaseModel:   baseModel,
		Name:        name,
		PluginID:    pluginID,
		Health:      health,
		Data:        data,
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}

	query := regexp.QuoteMeta(`INSERT INTO "plugins"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(query).
		WithArgs(sqlmock.AnyArg(), timeNow, name, pluginID.String(), health, data, workspaceID.String(), nil).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	_, err := s.repository.Save(expected)

	require.Error(s.T(), err)
}

func (s *Suite) TestSaveErrorWithHealth() {
	var id = uuid.New()
	var timeNow = time.Now()
	var (
		baseModel   = util.BaseModel{ID: id, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = true
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	expected := DataSource{
		BaseModel:   baseModel,
		Name:        name,
		PluginID:    pluginID,
		Health:      health,
		Data:        data,
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}

	query := regexp.QuoteMeta(`INSERT INTO "plugins"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(query).
		WithArgs(sqlmock.AnyArg(), timeNow, name, pluginID.String(), health, data, workspaceID.String(), nil).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	_, err := s.repository.Save(expected)

	require.Error(s.T(), err)
}
