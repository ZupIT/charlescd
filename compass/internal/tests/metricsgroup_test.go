package tests

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"compass/internal/util"
	"encoding/json"
	"io/ioutil"
	"os"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteMetricGroup struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository metricsgroup.UseCases
	datasource *metricsgroup.MetricsGroup
}

func (s *SuiteMetricGroup) SetupSuite() {
	var err error

	os.Setenv("ENV", "TEST")

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	metricMain := metric.NewMain(s.DB, datasourceMain, pluginMain)

	s.repository = metricsgroup.NewMain(s.DB, metricMain, datasourceMain, pluginMain)
}

func (s *SuiteMetricGroup) BeforeTest(suiteName, testName string) {
	s.DB.Exec("DELETE FROM metrics_groups")
	s.DB.Exec("DELETE FROM data_sources")
}

func TestInitMetricGroup(t *testing.T) {
	suite.Run(t, new(SuiteMetricGroup))
}

func (s *SuiteMetricGroup) TestValidate() {
	newMetricGroup := metricsgroup.MetricsGroup{
		Name:        "Metric group",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	errList := s.repository.Validate(newMetricGroup)
	require.Empty(s.T(), errList)
}

func (s *SuiteMetricGroup) TestValidateError() {
	newMetricGroup := metricsgroup.MetricsGroup{
		Name:        "",
		CircleID:    uuid.Nil,
		WorkspaceID: uuid.Nil,
	}

	ers := s.repository.Validate(newMetricGroup)

	require.Equal(s.T(), util.ErrorUtil{Field: "name", Error: "Name is required"}, ers[0])
	require.Equal(s.T(), util.ErrorUtil{Field: "circleID", Error: "CircleID is required"}, ers[1])
}

func (s *SuiteMetricGroup) TestValidateNameLength() {
	newMetricGroup := metricsgroup.MetricsGroup{
		Name:        "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	ers := s.repository.Validate(newMetricGroup)
	require.Equal(s.T(), util.ErrorUtil{Field: "name", Error: "100 Maximum length in Name"}, ers[0])
}

func (s *SuiteMetricGroup) TestPeriodValidate() {
	err := s.repository.PeriodValidate("1d")
	require.Nil(s.T(), err)
}

func (s *SuiteMetricGroup) TestPeriodValidateNotFoundNumber() {
	err := s.repository.PeriodValidate("d")

	require.Equal(s.T(), "Invalid period or interval: not found number", err.Error())
}

func (s *SuiteMetricGroup) TestPeriodValidateNotFoundUnit() {
	err := s.repository.PeriodValidate("1")

	require.Equal(s.T(), "Invalid period or interval: not found unit", err.Error())
}

func (s *SuiteMetricGroup) TestParseMetricsGroup() {
	stringReader := strings.NewReader(`{
    "name": "Metricas de teste2",
    "circleId": "b9d285fc-542b-4828-9e30-d28355b5fefb"
	}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.Parse(stringReadCloser)

	require.NoError(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *SuiteMetricGroup) TestParseMetricsGroupError() {
	stringReader := strings.NewReader(`{ERROR}`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)
	require.Error(s.T(), err)
}

func (s *SuiteMetricGroup) TestFindAll() {
	expectMetricGroups := []metricsgroup.MetricsGroup{
		{
			Name:        "group 1",
			Metrics:     []metric.Metric{},
			CircleID:    uuid.New(),
			WorkspaceID: uuid.New(),
		},
		{
			Name:        "group 2",
			Metrics:     []metric.Metric{},
			CircleID:    uuid.New(),
			WorkspaceID: uuid.New(),
		},
	}

	for _, metricgroup := range expectMetricGroups {
		s.DB.Create(&metricgroup)
	}

	list, err := s.repository.FindAll()
	require.NoError(s.T(), err)

	require.NotEmpty(s.T(), list)
	for index, item := range list {
		expectMetricGroups[index].BaseModel = item.BaseModel
		require.Equal(s.T(), item, expectMetricGroups[index])
	}
}

func (s *SuiteMetricGroup) TestFindById() {
	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	item, err := s.repository.FindById(metricgroup.ID.String())
	require.NoError(s.T(), err)

	metricgroup.BaseModel = item.BaseModel
	require.Equal(s.T(), item, metricgroup)
}

func (s *SuiteMetricGroup) TestSave() {
	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	createMetricGroup, err := s.repository.Save(metricgroup)
	require.NoError(s.T(), err)

	metricgroup.BaseModel = createMetricGroup.BaseModel
	require.Equal(s.T(), createMetricGroup, metricgroup)
}

func (s *SuiteMetricGroup) TestUpdate() {
	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	metricgroup.Name = "group 2"
	createMetricGroup, err := s.repository.Update(metricgroup.ID.String(), metricgroup)
	require.NoError(s.T(), err)

	metricgroup.BaseModel = createMetricGroup.BaseModel
	require.Equal(s.T(), createMetricGroup, metricgroup)
}

func (s *SuiteMetricGroup) TestDelete() {
	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	err := s.repository.Remove(metricgroup.ID.String())
	require.NoError(s.T(), err)
}

func (s *SuiteMetricGroup) TestFindCircleMetricGroups() {
	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    uuid.New(),
		WorkspaceID: uuid.New(),
	}

	s.DB.Create(&metricgroup)

	res, err := s.repository.FindCircleMetricGroups(metricgroup.CircleID.String())
	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
}

func (s *SuiteMetricGroup) TestFindByIdError() {
	_, err := s.repository.FindById("any-id")
	require.Error(s.T(), err)
}

func (s *SuiteMetricGroup) TestResumeByCircle() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	metric1 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName1",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleID,
	}

	metric2 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName2",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      5,
		CircleID:       circleID,
	}

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)

	expectedGroupResume := []metricsgroup.MetricGroupResume{
		{
			Name: metricgroup.Name,
			Thresholds: 2,
			ThresholdsReached: 0,
			Metrics: 2,
			Status: "ACTIVE",
		},
	}

	groupsResume, err := s.repository.ResumeByCircle(circleID.String())
	require.NoError(s.T(), err)

	for index, resume := range groupsResume {
		expectedGroupResume[index].BaseModel = resume.BaseModel
		require.Equal(s.T(), expectedGroupResume[index], resume)
	}
}

func (s *SuiteMetricGroup) TestQueryByGroupIDErrorNotFoundPlugin() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	metric1 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName1",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleID,
	}

	metric2 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName2",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      5,
		CircleID:       circleID,
	}

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)

	_, err := s.repository.QueryByGroupID(metricgroup.ID.String(), "5d", "30m")
	require.Error(s.T(), err)
}

func (s *SuiteMetricGroup) TestResultByGroupErrorNotFoundPlugin() {
	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.UUID{},
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: uuid.New(),
	}
	s.DB.Create(&metricgroup)

	metric1 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName1",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      1,
		CircleID:       circleID,
	}

	metric2 := metric.Metric{
		MetricsGroupID: metricgroup.ID,
		DataSourceID:   datasource.ID,
		Metric:         "MetricName2",
		Filters:        nil,
		GroupBy:        nil,
		Condition:      "=",
		Threshold:      5,
		CircleID:       circleID,
	}

	s.DB.Create(&metric1)
	s.DB.Create(&metric2)

	metricgroup.Metrics = []metric.Metric{
		metric1,
		metric2,
	}

	_, err := s.repository.ResultByGroup(metricgroup)
	require.Error(s.T(), err)
}