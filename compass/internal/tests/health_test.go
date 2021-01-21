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
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/health"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteHealth struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository health.UseCases
	server     *httptest.Server
}

func (s *SuiteHealth) SetupSuite() {
	setupEnv()
}

func (s *SuiteHealth) BeforeTest(_, _ string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.server = httptest.NewServer(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Content-Type", "application/json")
			w.Write([]byte(`[{"id": "123456", "name": "SomeName", "errorThreshold": 12.6, "latencyThreshold": 10.4, "moduleId": "12345", "moduleName": "SomeModuleName"}]`))
		}),
	)

	pluginMain := plugin.NewMain()
	datasourceMain := datasource.NewMain(s.DB, pluginMain)
	mooveMain := moove.NewAPIClient(s.server.URL, 45*time.Second)
	s.repository = health.NewMain(s.DB, datasourceMain, pluginMain, mooveMain)

	clearDatabase(s.DB)
}

func (s *SuiteHealth) AfterTest(_, _ string) {
	s.DB.Close()
	s.server.Close()
}

func TestInitHealth(t *testing.T) {
	suite.Run(t, new(SuiteHealth))
}

func (s SuiteHealth) TestComponentsHealthDataSourceError() {
	_, err := s.repository.ComponentsHealth("", uuid.New().String(), uuid.New())

	s.Require().NotNil(err)
}

func (s SuiteHealth) TestComponentsHealthGetPluginBySrcError() {
	workspaceId := uuid.New()
	circleId := uuid.New().String()
	datasourceStruct := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "datasource/prometheus/prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}
	s.DB.Create(&datasourceStruct)

	_, err := s.repository.ComponentsHealth("", circleId, workspaceId)

	s.Require().NotNil(err)
}

func (s SuiteHealth) TestComponentsHealthGetPluginBySrc() {
	circleId := uuid.New().String()
	dataSourceInsert, dataSourceStruct := datasourceInsert("datasource/prometheus/prometheus")

	s.DB.Exec(dataSourceInsert)

	_, err := s.repository.ComponentsHealth("", circleId, dataSourceStruct.WorkspaceID)
	s.Nil(err)
}

func (s SuiteHealth) TestComponentsError() {
	workspaceId := uuid.New()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_BY_CIRCLE"

	_, err := s.repository.Components("", circleId, projectionType, metricType, workspaceId)

	s.Require().NotNil(err)
}

func (s SuiteHealth) TestComponentsMetricTypeErrorByCircle() {
	workspaceId := uuid.New()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_ERRORS_BY_CIRCLE"

	_, err := s.repository.Components("", circleId, projectionType, metricType, workspaceId)

	s.Require().NotNil(err)
}

func (s SuiteHealth) TestComponentsMetricTypeLatencyByCircleError() {
	workspaceId := uuid.New()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_LATENCY_BY_CIRCLE"

	_, err := s.repository.Components("", circleId, projectionType, metricType, workspaceId)

	s.Require().NotNil(err)
}

func (s SuiteHealth) TestComponentsMetricTypeDefaultError() {
	workspaceId := uuid.New()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"

	_, err := s.repository.Components("", circleId, projectionType, "", workspaceId)

	s.Require().NotNil(err)
}

func (s SuiteHealth) TestComponents() {
	circleIdHeader := uuid.New().String()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_BY_CIRCLE"

	dataSourceInsert, dataSourceStruct := datasourceInsert("datasource/prometheus/prometheus")
	s.DB.Exec(dataSourceInsert)

	fmt.Println(dataSourceStruct)

	_, err := s.repository.Components(circleIdHeader, circleId, projectionType, metricType, dataSourceStruct.WorkspaceID)

	require.Nil(s.T(), err)
}
