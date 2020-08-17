package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"compass/pkg/logger/fake"
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"regexp"
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

	fakeLogger := fake.NewLoggerFake()

	var pluginMain = plugin.NewMain(s.DB, fakeLogger)
	var datasourceMain = datasource.NewMain(s.DB, pluginMain, fakeLogger)

	s.repository = NewMain(s.DB, datasourceMain, pluginMain, fakeLogger)
}

func TestInitMetric(t *testing.T) {
	suite.Run(t, new(SuiteMetric))
}

func (s *SuiteMetric) TestRemoveMetric() {
	id := uuid.New()
	query := regexp.QuoteMeta(`DELETE FROM "metrics"`)

	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	resErr := s.repository.RemoveMetric(id.String())

	require.NoError(s.T(), resErr)
	require.Nil(s.T(), resErr)
}
