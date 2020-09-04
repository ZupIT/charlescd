package tests

import (
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/dispatcher"
	"compass/internal/metric"
	"compass/internal/plugin"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"os"
	"testing"
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
	os.Setenv("DISPATCHER_INTERVAL", "1s")
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

func (s *SuiteDispatcher) TestStart() {
}