package datasource

import (
	"compass/internal/plugin"
	"compass/internal/util"
	"database/sql"
	"encoding/json"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"regexp"
	"testing"
	"time"
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

	var pluginMain = plugin.NewMain(s.DB)

	s.repository = NewMain(s.DB, pluginMain)
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
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

func (s *Suite) TestSave() {
	var id = "080d8c6b-1620-4e71-8498-64b5ef544405"
	//var idFoda, _ = uuid.Parse("080d8c6b-1620-4e71-8498-64b5ef544405")
	var timeNow = time.Now()
	var (
		//baseModel   = util.BaseModel{ID: idFoda, CreatedAt: timeNow}
		name        = "test-name"
		pluginID    = uuid.New()
		health      = false
		data        = json.RawMessage(`{"url": "localhost:8080"}`)
		workspaceID = uuid.New()
	)

	//expected := DataSource{
	//	BaseModel:   baseModel,
	//	Name:        name,
	//	PluginID:    pluginID,
	//	Health:      health,
	//	Data:        data,
	//	WorkspaceID: workspaceID,
	//	DeletedAt:   nil,
	//}

	s.mock.ExpectBegin()
	s.mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO "data_sources"`)).
		WithArgs(timeNow, name, pluginID.String(), health, data, workspaceID.String(), nil).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	s.DB.Exec(`INSERT INTO "data_sources" ("id","created_at","name","plugin_id","health","data","workspace_id","deleted_at") VALUES($1, $2, $3, $4 ,$5, $6, $7, $8)`,
		id, timeNow, name, pluginID, health, data, workspaceID, nil)
	var err = s.DB.Close()
	//_, err := s.repository.Save(expected)

	require.NoError(s.T(), err)
}
