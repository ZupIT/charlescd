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
	"encoding/json"
	"io/ioutil"
	"os"
	"strings"
	"testing"

	"github.com/ZupIT/charlescd/compass/internal/configuration"
	datasource2 "github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/plugin"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type Suite struct {
	suite.Suite
	DB *gorm.DB

	repository datasource2.UseCases
	datasource *datasource2.DataSource
}

func (s *Suite) SetupSuite() {
	setupEnv()
}

func (s *Suite) BeforeTest(suiteName, testName string) {
	var err error

	s.DB, err = configuration.GetDBConnection("../../migrations")
	require.Nil(s.T(), err)

	s.DB.LogMode(dbLog)

	var pluginMain = plugin.NewMain()
	s.repository = datasource2.NewMain(s.DB, pluginMain)
	clearDatabase(s.DB)
}

func (s *Suite) AfterTest(suiteName, testName string) {
	s.DB.Close()
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) TestParse() {
	stringReader := strings.NewReader(`{ "name": "Prometheus do maycao", "pluginId": "4bdcab48-483d-4136-8f41-318a5c7f1ec7", "data": { "url": "http://35.238.107.172:9090" } }`)
	stringReadCloser := ioutil.NopCloser(stringReader)

	res, err := s.repository.Parse(stringReadCloser)

	require.Nil(s.T(), err)
	require.NotNil(s.T(), res)
}

func (s *Suite) TestParseError() {
	stringReader := strings.NewReader(`{ "name": "Prometheus do maycao", "pluginfasdf": "4*bd" `)
	stringReadCloser := ioutil.NopCloser(stringReader)

	_, err := s.repository.Parse(stringReadCloser)

	require.NotNil(s.T(), err)
}

func (s *Suite) TestValidate() {
	datasource := datasource2.Request{}
	var errList = s.repository.Validate(datasource)

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestValidateNameLength() {
	datasource := datasource2.Request{
		Name:      bigString,
		PluginSrc: bigString,
	}
	var errList = s.repository.Validate(datasource)

	require.NotEmpty(s.T(), errList)
}

func (s *Suite) TestFindDataSourceById() {
	dataSourceInsert, dataSourceStruct := datasourceInsert("src.so")

	s.DB.Exec(dataSourceInsert)
	res, err := s.repository.FindByID(dataSourceStruct.ID.String())

	require.Nil(s.T(), err)
	dataSourceStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), dataSourceStruct, res)
}

func (s *Suite) TestFindAllByWorkspace() {
	dataSourceStruct := datasource2.DataSource{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}
	s.DB.Create(&dataSourceStruct)

	res, err := s.repository.FindAllByWorkspace(dataSourceStruct.WorkspaceID)

	require.Nil(s.T(), err)
	require.NotEmpty(s.T(), res)
}

func (s *Suite) TestFindAllByWorkspaceError() {
	s.DB.Close()
	_, err := s.repository.FindAllByWorkspace(uuid.New())

	require.NotNil(s.T(), err)
}

func (s *Suite) TestSaveDatasource() {
	dataSourceStruct := datasource2.Request{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	res, err := s.repository.Save(dataSourceStruct)

	require.Nil(s.T(), err)

	dataSourceStruct.BaseModel = res.BaseModel
	require.Equal(s.T(), dataSourceStruct.BaseModel, res.BaseModel)
	require.Equal(s.T(), dataSourceStruct.WorkspaceID, res.WorkspaceID)
	require.Equal(s.T(), dataSourceStruct.PluginSrc, res.PluginSrc)
}

func (s *Suite) TestSaveDatasourceError() {
	dataSourceStruct := datasource2.Request{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	s.DB.Close()
	_, err := s.repository.Save(dataSourceStruct)
	require.NotNil(s.T(), err)
}

func (s *Suite) TestDelete() {
	workspaceId := uuid.New()
	dataSource := datasource2.DataSource{
		Name:        "DataTest2",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)

	err := s.repository.Delete(dataSource.ID.String())
	require.Nil(s.T(), err)
}

func (s *Suite) TestFindByIdNotFoundError() {
	_, err := s.repository.FindByID("any-id")
	require.NotNil(s.T(), err)
}

func (s *Suite) TestDeleteError() {
	s.DB.Close()
	err := s.repository.Delete("any-id")
	require.NotNil(s.T(), err)
}

func (s *Suite) TestGetMetricsNotFoundError() {
	datasourceId := uuid.New().String()
	_, err := s.repository.GetMetrics(datasourceId)

	require.NotNil(s.T(), err)
}

func (s *Suite) TestGetMetricsError() {
	workspaceId := uuid.New()
	dataSource := datasource2.DataSource{
		Name:        "DataTest2",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	s.DB.Create(&dataSource)

	_, err := s.repository.GetMetrics(dataSource.ID.String())

	require.NotNil(s.T(), err)
}

func (s *Suite) TestConnectionJsonError() {
	jsonData := json.RawMessage(`{"data": "prometheus"}`)
	err := s.repository.TestConnection("datasource/errorconnection/errorconnection", jsonData)

	require.NotNil(s.T(), err)
}

func (s *Suite) TestConnection() {
	jsonData := json.RawMessage(`{"url": "http://localhost:9090"}`)
	err := s.repository.TestConnection("datasource/validaction/validaction", jsonData)

	require.Nil(s.T(), err)
}

func (s *Suite) TestConnectionPluginDirError() {
	os.Setenv("PLUGINS_DIR", "/dist")

	jsonData := json.RawMessage(`{"url": "http://localhost:9090"}`)
	err := s.repository.TestConnection("datasource/validaction/validaction", jsonData)

	require.NotNil(s.T(), err)
}
