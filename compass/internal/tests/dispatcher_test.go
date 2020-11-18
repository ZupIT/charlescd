/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package tests

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/dispatcher"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
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

	repository dispatcher.UseCases
	metricMain metric.UseCases
}

func (s *SuiteDispatcher) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *SuiteDispatcher) AfterTest(_, _ string) {
	s.DB.Close()
}

func (s *SuiteDispatcher) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	s.metricMain = metric.NewMain(s.DB, datasourceMain, pluginMain)
	s.repository = dispatcher.NewDispatcher(s.metricMain)

	clearDatabase(s.DB)
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
	stopChan <- true

	execution, err := s.metricMain.FindAllMetricExecutions()
	require.NoError(s.T(), err)

	require.Equal(s.T(), "ERROR", execution[0].Status)
}
