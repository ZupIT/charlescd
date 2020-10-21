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
	"compass/internal/action"
	"compass/internal/configuration"
	"compass/internal/datasource"
	"compass/internal/dispatcher"
	"compass/internal/metric"
	"compass/internal/metricsgroup"
	"compass/internal/metricsgroupaction"
	"compass/internal/plugin"
	"encoding/json"
	"os"
	"testing"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteActionDispatcher struct {
	suite.Suite
	DB *gorm.DB

	repository             dispatcher.UseCases
	metricMain             metric.UseCases
	metricsGroupActionMain metricsgroupaction.UseCases
}

func (s *SuiteActionDispatcher) SetupSuite() {
	os.Setenv("ENV", "TEST")
}

func (s *SuiteActionDispatcher) afterTest(_, _ string) {
	s.DB.Close()
}

func (s *SuiteActionDispatcher) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	s.metricMain = metric.NewMain(s.DB, datasourceMain, pluginMain)
	actionMain := action.NewMain(s.DB, pluginMain)
	s.metricsGroupActionMain = metricsgroupaction.NewMain(s.DB, pluginMain, actionMain)
	metricsgroupMain := metricsgroup.NewMain(s.DB, s.metricMain, datasourceMain, pluginMain, s.metricsGroupActionMain)
	s.repository = dispatcher.NewActionDispatcher(metricsgroupMain, actionMain, pluginMain, s.metricMain, s.metricsGroupActionMain)

	clearDatabase(s.DB)
}

func TestInitActionsDispatcher(t *testing.T) {
	suite.Run(t, new(SuiteDispatcher))
}

func (s *SuiteActionDispatcher) TestStartMetricProviderError() {
	os.Setenv("DISPATCHER_INTERVAL", "1s")
	stopChan := make(chan bool, 1)
	go s.repository.Start(stopChan)

	circleID := uuid.New()
	workspaceID := uuid.New()
	datasource := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:908"}`),
		WorkspaceID: workspaceID,
		DeletedAt:   nil,
	}
	s.DB.Create(&datasource)

	metricgroup := metricsgroup.MetricsGroup{
		Name:        "group 1",
		Metrics:     []metric.Metric{},
		CircleID:    circleID,
		WorkspaceID: workspaceID,
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
	s.DB.Create(&metric1)

	action := action.Action{
		WorkspaceId:   workspaceID,
		Nickname:      "Action 1",
		Type:          "circledeployment",
		Description:   "",
		Configuration: json.RawMessage(`{"mooveUrl": "http://localhost:8081"}`),
	}
	s.DB.Create(&action)

	// metricgroupactionId := uuid.New()
	actiongroup := metricsgroupaction.MetricsGroupAction{
		MetricsGroupID:      metricgroup.ID,
		ActionID:            action.ID,
		Nickname:            "Metric group action 1",
		ExecutionParameters: json.RawMessage(`{"destinationCircleId": "a407fdb4-e20f-40e8-bb61-1670d4abf56e", "workspaceId": "6a14448c-8346-4f56-ae2a-a63cf5fca1fd", "originCircleId": "b3edfa7b-c088-48c6-a185-15c46ab61681"}`),
		ActionsConfiguration: metricsgroupaction.ActionsConfiguration{
			Repeatable:     false,
			NumberOfCycles: 1,
		},
	}

	_, err := s.metricsGroupActionMain.SaveGroupAction(actiongroup)
	require.NoError(s.T(), err)
}
