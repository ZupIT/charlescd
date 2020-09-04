package tests

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/dispatcher"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"os"
	"testing"
	"time"
)

type SuiteDispatcher struct {
	suite.Suite
	DB *gorm.DB

	repository   dispatcher.UseCases
	metricMain metric.UseCases
}

func (s *SuiteDispatcher) SetupSuite() {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	s.metricMain = metric.NewMain(s.DB, datasourceMain, pluginMain)
	s.repository = dispatcher.NewDispatcher(s.metricMain)
}

func (s *SuiteDispatcher) BeforeTest(suiteName, testName string) {
	s.DB.Exec("DELETE FROM metric_filters")
	s.DB.Exec("DELETE FROM metric_group_bies")
	s.DB.Exec("DELETE FROM metrics")
	s.DB.Exec("DELETE FROM metrics_groups")
	s.DB.Exec("DELETE FROM data_sources")
	s.DB.Exec("DELETE FROM metric_executions")
}


func TestInitDispatcher(t *testing.T) {
	suite.Run(t, new(SuiteDispatcher))
}

func (s *SuiteDispatcher) TestStartMetricProviderError() {
	os.Setenv("DISPATCHER_INTERVAL", "1s")
	stopChan := make(chan bool, 1)
	go s.repository.Start(stopChan)

	circleID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:908"}`),
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

	_, err := s.metricMain.SaveMetric(metric1)
	require.NoError(s.T(), err)

	time.Sleep(2 * time.Second)
	stopChan<-true

	execution, err := s.metricMain.FindAllMetricExecutions()
	require.NoError(s.T(), err)

	require.Equal(s.T(), "ERROR", execution[0].Status)
}