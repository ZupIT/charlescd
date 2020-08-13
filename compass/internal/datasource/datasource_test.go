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
