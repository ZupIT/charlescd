package metricsgroup

import (
	"compass/internal/datasource"
	"compass/internal/plugin"
	"compass/internal/util"
	"compass/pkg/logger/fake"
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"io/ioutil"
	"regexp"
	"strings"
	"testing"
	"time"
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

func (s *SuiteMetric) TestValidateMetric() {
	metric := Metric{}
	var errList = metric.Validate()

	require.NotEmpty(s.T(), errList)
}

func (s *SuiteMetric) TestParse() {
	stringReader := strings.NewReader(`{
    "dataSourceId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7",
    "metricGroupId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7",
    "metric": "metric 213",
    "filters": [
        {
            "field": "destination",
            "value": "moove",
            "operator": "EQUAL"
        }
    ],
    "groupBy": [
        {
            "field": "app"
        }
    ],
    "condition": "EQUAL",
    "threshold": 30.0
}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.ParseMetric(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *SuiteMetric) TestParseError() {
	stringReader := strings.NewReader(`{ "dataSourceId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7saldajsndas" }`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.ParseMetric(stringReadCloser)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestRemoveMetric() {
	id := uuid.New()
	query := regexp.QuoteMeta(`DELETE FROM "metrics"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	resErr := s.repository.RemoveMetric(id.String())

	require.NoError(s.T(), resErr)
	require.Nil(s.T(), resErr)
}

func (s *SuiteMetric) TestRemoveMetricError() {
	id := uuid.New()
	query := regexp.QuoteMeta(`DELETE FROM "error"`)

	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	err := s.repository.RemoveMetric(id.String())

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestSaveMetric() {
	id := uuid.New()
	metricsGroupId := uuid.New()
	dataSourceId := uuid.New()
	timeNow := time.Now()
	metricStruct := Metric{
		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
		MetricsGroupID: metricsGroupId,
		DataSourceID:   dataSourceId,
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		Status:         "ACTIVE",
	}

	query := regexp.QuoteMeta(`INSERT INTO "metrics"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(query).
		WithArgs(sqlmock.AnyArg(),
			metricStruct.CreatedAt,
			metricStruct.MetricsGroupID.String(),
			metricStruct.DataSourceID.String(),
			metricStruct.Metric,
			metricStruct.Condition,
			metricStruct.Threshold,
			metricStruct.Status).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	res, err := s.repository.SaveMetric(metricStruct)

	require.NoError(s.T(), err)
	require.Equal(s.T(), metricStruct, res)
}

func (s *SuiteMetric) TestSaveMetricError() {
	id := uuid.New()
	metricsGroupId := uuid.New()
	dataSourceId := uuid.New()
	timeNow := time.Now()
	metricStruct := Metric{
		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
		MetricsGroupID: metricsGroupId,
		DataSourceID:   dataSourceId,
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		Status:         "ACTIVE",
	}

	query := regexp.QuoteMeta(`INSERT INTO "ERROR"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectQuery(query).
		WithArgs(sqlmock.AnyArg(),
			metricStruct.CreatedAt,
			metricStruct.MetricsGroupID.String(),
			metricStruct.DataSourceID.String(),
			metricStruct.Metric,
			metricStruct.Condition,
			metricStruct.Threshold,
			metricStruct.Status).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	_, err := s.repository.SaveMetric(metricStruct)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestUpdateMetric() {
	id := uuid.New()
	metricsGroupId := uuid.New()
	dataSourceId := uuid.New()
	timeNow := time.Now()
	metricStruct := Metric{
		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
		MetricsGroupID: metricsGroupId,
		DataSourceID:   dataSourceId,
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		Status:         "ACTIVE",
	}

	query := regexp.QuoteMeta(`UPDATE "metrics"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	res, err := s.repository.UpdateMetric(id.String(), metricStruct)

	require.NoError(s.T(), err)
	require.Equal(s.T(), metricStruct, res)
}

func (s *SuiteMetric) TestUpdateMetricError() {
	id := uuid.New()
	metricsGroupId := uuid.New()
	dataSourceId := uuid.New()
	timeNow := time.Now()
	metricStruct := Metric{
		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
		MetricsGroupID: metricsGroupId,
		DataSourceID:   dataSourceId,
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		Status:         "ACTIVE",
	}

	query := regexp.QuoteMeta(`UPDATE "ERROR"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectExec(query).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()

	_, err := s.repository.UpdateMetric(id.String(), metricStruct)

	require.Error(s.T(), err)
}
