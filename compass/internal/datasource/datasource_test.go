package datasource

import (
	"compass/internal/plugin"
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
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

