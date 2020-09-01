package tests

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	metric2 "compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"compass/internal/util"
	"encoding/json"
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

	repository metric2.UseCases
	metric     *metric2.Metric
}

func (s *SuiteMetric) SetupSuite() {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(true)

	pluginMain := plugin.NewMain(s.DB)
	datasourceMain := datasource.NewMain(s.DB, pluginMain)

	s.repository = metric2.NewMain(s.DB, datasourceMain, pluginMain)
}

func (s *SuiteMetric) BeforeTest(suiteName, testName string) {
	s.DB.Exec("DELETE FROM metric_filters")
	s.DB.Exec("DELETE FROM metric_group_bies")
	s.DB.Exec("DELETE FROM metrics")
	s.DB.Exec("DELETE FROM metrics_groups")
	s.DB.Exec("DELETE FROM data_sources")
}

func TestInitMetric(t *testing.T) {
	suite.Run(t, new(SuiteMetric))
}

func (s *SuiteMetric) TestValidateMetric() {
	metric := metric2.Metric{}
	var errList = s.repository.Validate(metric)

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
	metricQuery := regexp.QuoteMeta(`DELETE FROM "metrics"`)
	metricExecQuery := regexp.QuoteMeta(`DELETE FROM "metric_executions"`)

	s.mock.MatchExpectationsInOrder(false)
	s.mock.ExpectBegin()
	s.mock.ExpectBegin()
	s.mock.ExpectExec(metricQuery).
		WillReturnResult(sqlmock.NewResult(1, 1))
	s.mock.ExpectCommit()
	s.mock.ExpectExec(metricExecQuery).
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
	circleId := uuid.New()

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	dataSource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)
	s.DB.Create(&metricgroup)

	metricStruct := metric2.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   dataSource.ID,
		Query:          "group_metric_example_2",
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	res, err := s.repository.SaveMetric(metricStruct)

	require.NoError(s.T(), err)

	metricStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), res, metricStruct)
}

func (s *SuiteMetric) TestUpdateMetric() {
	id := uuid.New()
	metricsGroupId := uuid.New()
	dataSourceId := uuid.New()
	timeNow := time.Now()
	metricStruct := metric2.Metric{
		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
		MetricsGroupID: metricsGroupId,
		DataSourceID:   dataSourceId,
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
	}

	res, err := s.repository.UpdateMetric(id.String(), metricStruct)

	require.NoError(s.T(), err)
	require.Equal(s.T(), metricStruct, res)
}

//
//func (s *SuiteMetric) TestSaveMetricError() {
//	id := uuid.New()
//	metricsGroupId := uuid.New()
//	dataSourceId := uuid.New()
//	timeNow := time.Now()
//	metricStruct := Metric{
//		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
//		MetricsGroupID: metricsGroupId,
//		DataSourceID:   dataSourceId,
//		Metric:         "MetricName",
//		Filters:        nil,
//		GroupBy:        nil,
//		Condition:      "=",
//		Threshold:      1,
//	}
//
//	query := regexp.QuoteMeta(`INSERT INTO "ERROR"`)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectBegin()
//	s.mock.ExpectQuery(query).
//		WithArgs(sqlmock.AnyArg(),
//			metricStruct.CreatedAt,
//			metricStruct.MetricsGroupID.String(),
//			metricStruct.DataSourceID.String(),
//			metricStruct.Metric,
//			metricStruct.Condition,
//			metricStruct.Threshold).
//		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
//	s.mock.ExpectCommit()
//
//	_, err := s.repository.SaveMetric(metricStruct)
//
//	require.Error(s.T(), err)
//}
//
//func (s *SuiteMetric) TestUpdateMetric() {
//	id := uuid.New()
//	metricsGroupId := uuid.New()
//	dataSourceId := uuid.New()
//	timeNow := time.Now()
//	metricStruct := Metric{
//		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
//		MetricsGroupID: metricsGroupId,
//		DataSourceID:   dataSourceId,
//		Metric:         "MetricName",
//		Filters:        nil,
//		GroupBy:        nil,
//		Condition:      "=",
//		Threshold:      1,
//	}
//
//	query := regexp.QuoteMeta(`UPDATE "metrics"`)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectBegin()
//	s.mock.ExpectExec(query).
//		WillReturnResult(sqlmock.NewResult(1, 1))
//	s.mock.ExpectCommit()
//
//	res, err := s.repository.UpdateMetric(id.String(), metricStruct)
//
//	require.NoError(s.T(), err)
//	require.Equal(s.T(), metricStruct, res)
//}
//
//func (s *SuiteMetric) TestUpdateMetricError() {
//	id := uuid.New()
//	metricsGroupId := uuid.New()
//	dataSourceId := uuid.New()
//	timeNow := time.Now()
//	metricStruct := Metric{
//		BaseModel:      util.BaseModel{ID: id, CreatedAt: timeNow},
//		MetricsGroupID: metricsGroupId,
//		DataSourceID:   dataSourceId,
//		Metric:         "MetricName",
//		Filters:        nil,
//		GroupBy:        nil,
//		Condition:      "=",
//		Threshold:      1,
//	}
//
//	query := regexp.QuoteMeta(`UPDATE "ERROR"`)
//
//	s.mock.MatchExpectationsInOrder(false)
//	s.mock.ExpectBegin()
//	s.mock.ExpectExec(query).
//		WillReturnResult(sqlmock.NewResult(1, 1))
//	s.mock.ExpectCommit()
//
//	_, err := s.repository.UpdateMetric(id.String(), metricStruct)
//
//	require.Error(s.T(), err)
//}
