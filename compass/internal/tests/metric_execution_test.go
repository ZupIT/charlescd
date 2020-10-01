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
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/metric"
	metric2 "compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"encoding/json"
	"os"
	"testing"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteMetricExecution struct {
	suite.Suite
	DB *gorm.DB

	repository   metric.UseCases
	metricsgroup *metricsgroup.MetricsGroup
}

func (s *SuiteMetricExecution) SetupSuite() {
	var err error

	os.Setenv("ENV", "TEST")

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)

	s.repository = metric.NewMain(s.DB, datasourceMain, pluginMain)
}

func (s *SuiteMetricExecution) BeforeTest(suiteName, testName string) {
	s.DB.Exec("DELETE FROM metric_filters")
	s.DB.Exec("DELETE FROM metric_group_bies")
	s.DB.Exec("DELETE FROM metrics")
	s.DB.Exec("DELETE FROM metrics_groups")
	s.DB.Exec("DELETE FROM data_sources")
	s.DB.Exec("DELETE FROM metric_executions")
}

func TestInitMetricExecutions(t *testing.T) {
	suite.Run(t, new(SuiteMetricExecution))
}

func (s *SuiteMetricExecution) TestFindAllMetricExecutions() {
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
		Metrics:     []metric2.Metric{},
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

	metric1Created, err := s.repository.SaveMetric(metric1)
	require.NoError(s.T(), err)

	metric2Created, err := s.repository.SaveMetric(metric2)
	require.NoError(s.T(), err)

	expectedExecutions := []metric.MetricExecution{
		{
			MetricID:  metric1Created.ID,
			LastValue: 0,
			Status:    "ACTIVE",
		},
		{
			MetricID:  metric2Created.ID,
			LastValue: 0,
			Status:    "ACTIVE",
		},
	}

	metricExecutions, err := s.repository.FindAllMetricExecutions()
	require.NoError(s.T(), err)

	for index, execution := range metricExecutions {
		expectedExecutions[index].BaseModel = execution.BaseModel
		require.Equal(s.T(), expectedExecutions[index], execution)
	}
}

func (s *SuiteMetricExecution) TestUpdateMetricExecution() {
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
		Metrics:     []metric2.Metric{},
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

	metricCreated, err := s.repository.SaveMetric(metric1)
	require.NoError(s.T(), err)

	executions, err := s.repository.FindAllMetricExecutions()
	require.NoError(s.T(), err)

	require.Equal(s.T(), metric.MetricExecution{
		BaseModel: executions[0].BaseModel,
		MetricID:  metricCreated.ID,
		LastValue: 0,
		Status:    "ACTIVE",
	}, executions[0])

	updateExecution := metric.MetricExecution{
		BaseModel: executions[0].BaseModel,
		MetricID:  metricCreated.ID,
		LastValue: 0,
		Status:    "REACHED",
	}

	_, err = s.repository.UpdateMetricExecution(updateExecution)
	require.NoError(s.T(), err)

	newExecutions, err := s.repository.FindAllMetricExecutions()
	require.NoError(s.T(), err)

	require.Equal(s.T(), metric.MetricExecution{
		BaseModel: newExecutions[0].BaseModel,
		MetricID:  metricCreated.ID,
		LastValue: 0,
		Status:    "REACHED",
	}, newExecutions[0])
}
