package tests

import (
	"compass/internal/configuration"
	"compass/internal/moove"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

type SuiteMoove struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository moove.APIClient
	server     *httptest.Server
}

func (s *SuiteMoove) SetupSuite() {
	setupEnv()
}

func (s *SuiteMoove) BeforeTest(suiteName, testName string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.NoError(s.T(), err)

	s.DB.LogMode(dbLog)

	s.server = httptest.NewServer(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(500)
			w.Write([]byte(`[{"id": "123456", "name": "SomeName", "errorThreshold": 12.6, "latencyThreshold": 10.4, "moduleId": "12345", "moduleName": "SomeModuleName"}]`))
		}),
	)

	s.repository = moove.NewAPIClient(s.server.URL, 45*time.Second)

}

func (s *SuiteMoove) AfterTest(suiteName, testName string) {
	s.DB.Close()
	s.server.Close()
}

func TestInitMoove(t *testing.T) {
	suite.Run(t, new(SuiteMoove))
}

func (s *SuiteMoove) TestGetMooveComponentsError() {
	s.server.Close()
	_, err := s.repository.GetMooveComponents("", "", "")
	require.Error(s.T(), err)
}

func (s *SuiteMoove) TestGetMooveComponentsStatusError() {
	_, err := s.repository.GetMooveComponents("", "", "")
	require.Error(s.T(), err)
}
