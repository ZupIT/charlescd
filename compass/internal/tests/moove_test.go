/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteMoove struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository moove.APIUseCases
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

func (s *SuiteMoove) AfterTest(_, _ string) {
	s.DB.Close()
	s.server.Close()
}

func TestInitMoove(t *testing.T) {
	suite.Run(t, new(SuiteMoove))
}

func (s *SuiteMoove) TestGetMooveComponentsError() {
	s.server.Close()
	_, err := s.repository.GetMooveComponents("", "", uuid.New())
	require.NotNil(s.T(), err)
}

func (s *SuiteMoove) TestGetMooveComponentsStatusError() {
	_, err := s.repository.GetMooveComponents("", "", uuid.New())
	require.NotNil(s.T(), err)
}
