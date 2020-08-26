package metric

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type SuiteMetric struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository UseCases
	metric     *Metric
}

func (s *SuiteMetric) SetupSuite() {
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
	var datasourceMain = datasource.NewMain(s.DB, pluginMain)

	s.repository = NewMain(s.DB, datasourceMain, pluginMain)
}

func TestInitMetric(t *testing.T) {
	suite.Run(t, new(SuiteMetric))
}
