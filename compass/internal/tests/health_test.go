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
	"os"
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
	os.Setenv("ENV", "TEST")

}

func (s *SuiteHealth) BeforeTest(suiteName, testName string) {
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

	s.DB.Exec("DELETE FROM metrics_groups")
	s.DB.Exec("DELETE FROM data_sources")
}

func (s *SuiteHealth) AfterTest(suiteName, testName string) {
	s.DB.Close()
	s.server.Close()
}

func TestInitHealth(t *testing.T) {
	suite.Run(t, new(SuiteHealth))
}

func (s SuiteHealth) TestComponentsHealthDataSourceError() {
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()

	_, err := s.repository.ComponentsHealth(workspaceId, circleId)

	s.Require().Error(err)
}

func (s SuiteHealth) TestComponentsHealthGetPluginBySrcError() {
	os.Setenv("PLUGINS_DIR", "../../dist")
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

	_, err := s.repository.ComponentsHealth(workspaceId.String(), circleId)

	s.Require().Error(err)
}

func (s SuiteHealth) TestComponentsHealthGetPluginBySrc() {
	os.Setenv("PLUGINS_DIR", "../../dist")
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

	_, err := s.repository.ComponentsHealth(workspaceId.String(), circleId)
	s.NoError(err)
}

func (s SuiteHealth) TestComponentsError() {
	workspaceId := uuid.New().String()
	circleId := uuid.New().String()
	projectionType := "FIVE_MINUTES"
	metricType := "REQUESTS_BY_CIRCLE"

	_, err := s.repository.Components(workspaceId, circleId, projectionType, metricType)

	s.Require().Error(err)
}
