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
	"compass/internal/health"
	"compass/internal/moove"
	"compass/internal/plugin"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

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
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()

	_, err := s.repository.ComponentsHealth("", workspaceId, circleId)

	s.Require().Error(err)
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

	_, err := s.repository.ComponentsHealth("", workspaceId.String(), circleId)

	s.Require().Error(err)
}

func (s SuiteHealth) TestComponentsHealthGetPluginBySrc() {
	workspaceId := uuid.New()
	circleId := uuid.New().String()
	datasourceStruct := datasource.DataSource{
		Name:        "DataTest",
		PluginSrc:   "datasource/prometheus/prometheus",
		Health:      true,
		Data:        json.RawMessage(`{"url": "http://localhost:9090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}
	s.DB.Create(&datasourceStruct)

	_, err := s.repository.ComponentsHealth("", workspaceId.String(), circleId)
	s.NoError(err)
}

func (s SuiteHealth) TestComponentsError() {
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_BY_CIRCLE"

	_, err := s.repository.Components("", workspaceId, circleId, projectionType, metricType)

	s.Require().Error(err)
}

func (s SuiteHealth) TestComponentsMetricTypeErrorByCircle() {
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_ERRORS_BY_CIRCLE"

	_, err := s.repository.Components("", workspaceId, circleId, projectionType, metricType)

	s.Require().Error(err)
}

func (s SuiteHealth) TestComponentsMetricTypeLatencyByCircleError() {
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_LATENCY_BY_CIRCLE"

	_, err := s.repository.Components("", workspaceId, circleId, projectionType, metricType)

	s.Require().Error(err)
}

func (s SuiteHealth) TestComponentsMetricTypeDefaultError() {
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"

	_, err := s.repository.Components("", workspaceId, circleId, projectionType, "")

	s.Require().Error(err)
}
