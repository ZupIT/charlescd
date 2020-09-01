package tests

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	metric2 "compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	datasource2 "compass/pkg/datasource"
	"encoding/json"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"io/ioutil"
	"strings"
	"testing"
)

const BigString = `That's is a big Field-Value, probably with more than 100 characters. We are testing the validate method.`

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
	filters := make([]datasource2.MetricFilter, 0)
	filters = append(filters, datasource2.MetricFilter{Field: BigString, Value: BigString, Operator: "="})

	groupBy := make([]metric2.MetricGroupBy, 0)
	groupBy = append(groupBy, metric2.MetricGroupBy{Field: BigString})

	metric := metric2.Metric{
		Nickname: BigString,
		Filters:  filters,
		GroupBy:  groupBy,
	}
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
	circleId := uuid.New()

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    circleId,
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
		Metric:         "MetricName",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	s.DB.Create(&metricStruct)

	metricStruct.Metric = "Name"

	res, err := s.repository.UpdateMetric(metricStruct.ID.String(), metricStruct)

	require.NoError(s.T(), err)

	metricStruct.BaseModel = res.BaseModel
	metricStruct.MetricExecution.Status = res.MetricExecution.Status
	require.Equal(s.T(), metricStruct, res)
}

func (s *SuiteMetric) TestRemoveMetric() {
	id := uuid.New()

	resErr := s.repository.RemoveMetric(id.String())

	require.NoError(s.T(), resErr)
	require.Nil(s.T(), resErr)
}

func (s *SuiteMetric) TestFindMetricById() {
	circleId := uuid.New()

	metricGroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric2.Metric{},
		CircleID:    circleId,
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
	s.DB.Create(&metricGroup)
	metricStruct := metric2.Metric{
		MetricsGroupID: metricGroup.ID,
		DataSourceID:   dataSource.ID,
		Metric:         "MetricName",
		Filters:        []datasource2.MetricFilter{},
		GroupBy:        []metric2.MetricGroupBy{},
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleId,
	}

	s.DB.Create(&metricStruct)

	res, err := s.repository.FindMetricById(metricStruct.ID.String())

	require.NoError(s.T(), err)

	metricStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), metricStruct, res)
}

func (s *SuiteMetric) TestSaveMetricError() {
	circleId := uuid.New()

	metricStruct := metric2.Metric{
		Query:     "group_metric_example_2",
		Metric:    "MetricName",
		Filters:   nil,
		GroupBy:   nil,
		Condition: "=",
		Threshold: 1,
		CircleID:  circleId,
	}

	_, err := s.repository.SaveMetric(metricStruct)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestUpdateMetricError() {
	circleId := uuid.New()

	metricStruct := metric2.Metric{
		Metric:    "MetricName",
		Filters:   nil,
		GroupBy:   nil,
		Condition: "=",
		Threshold: 1,
		CircleID:  circleId,
	}

	s.DB.Create(&metricStruct)

	metricStruct.Metric = "Name"

	_, err := s.repository.UpdateMetric(metricStruct.ID.String(), metricStruct)

	require.Error(s.T(), err)
}

func (s *SuiteMetric) TestFindMetricByIdError() {

	_, err := s.repository.FindMetricById("any-id")

	require.Error(s.T(), err)
}
