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
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	datasource2 "github.com/ZupIT/charlescd/compass/internal/use_case/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	mocks "github.com/ZupIT/charlescd/compass/tests/mocks/repository"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"testing"
)

type DatasourceSuite struct {
	suite.Suite
	deleteDatasource   datasource2.DeleteDatasource
	findAllDatasources datasource2.FindAllDatasource
	getMetrics         datasource2.GetMetrics
	saveDatasource     datasource2.SaveDatasource
	testConnection     datasource2.TestConnection
	dataSourceRep      *mocks.DatasourceRepository
}

func (d *DatasourceSuite) SetupSuite() {
	d.dataSourceRep = new(mocks.DatasourceRepository)
	d.deleteDatasource = datasource2.NewDeleteDatasource(d.dataSourceRep)
	d.findAllDatasources = datasource2.NewFindAllDatasource(d.dataSourceRep)
	d.getMetrics = datasource2.NewGetMetrics(d.dataSourceRep)
	d.saveDatasource = datasource2.NewDatasource(d.dataSourceRep)
	d.testConnection = datasource2.NewTestConnection(d.dataSourceRep)
}

func TestDatasourceSuite(t *testing.T) {
	suite.Run(t, new(DatasourceSuite))
}

func (d *DatasourceSuite) BeforeTest(suiteName, testName string) {
	d.SetupSuite()
}

func (d *DatasourceSuite) TestFindAllByWorkspace() {
	d.dataSourceRep.On("FindAllByWorkspace", mock.Anything).Return([]domain.Datasource{}, nil)
	a, err := d.findAllDatasources.Execute(uuid.New())

	require.NotNil(d.T(), a)
	require.Nil(d.T(), err)
}

func (d *DatasourceSuite) TestFindAllByWorkspaceError() {
	d.dataSourceRep.On("FindAllByWorkspace", mock.Anything).Return(
		[]domain.Datasource{},
	    logging.NewError("error", errors.New("some error"), nil))

	_, err := d.findAllDatasources.Execute(uuid.New())
	require.Error(d.T(), err)
}


func (d *DatasourceSuite) TestSaveDatasource() {
	domainDatasource := newBasicDatasource()

	d.dataSourceRep.On("Save", mock.Anything).Return(domainDatasource, nil)
	res, err := d.saveDatasource.Execute(domainDatasource)

	require.Nil(d.T(), err)

	domainDatasource.BaseModel = res.BaseModel
	require.Equal(d.T(), domainDatasource.BaseModel, res.BaseModel)
	require.Equal(d.T(), domainDatasource.WorkspaceID, res.WorkspaceID)
	require.Equal(d.T(), domainDatasource.PluginSrc, res.PluginSrc)
}

func (d *DatasourceSuite) TestSaveDatasourceError() {
	d.dataSourceRep.On("Save", mock.Anything).Return(domain.Datasource{},
		logging.NewError("error", errors.New("some error"), nil))

	_, err := d.saveDatasource.Execute(domain.Datasource{})
	require.Error(d.T(), err)
}

func (d *DatasourceSuite) TestDelete() {
	workspaceId := uuid.New()

	d.dataSourceRep.On("Delete", mock.Anything).Return( nil)
	err := d.deleteDatasource.Execute(workspaceId)

	require.Nil(d.T(), err)
}

func (d *DatasourceSuite) TestDeleteError() {
	workspaceId := uuid.New()

	d.dataSourceRep.On("Delete", mock.Anything).Return(logging.NewError("error", errors.New("some error"), nil))
	err := d.deleteDatasource.Execute(workspaceId)

	require.Error(d.T(), err)
}


func (d *DatasourceSuite) TestGetMetrics() {
	metricsList := datasource.MetricList{"metric1","metric2"}

	d.dataSourceRep.On("GetMetrics", mock.Anything).Return( metricsList, nil)
	res, err := d.getMetrics.Execute(uuid.New())

	require.NotNil(d.T(), res)
	require.Nil(d.T(), err)
	require.Equal(d.T(), res[0], "metric1")
}


func (d *DatasourceSuite) TestGetMetricsError() {
	d.dataSourceRep.On("GetMetrics", mock.Anything).Return( nil,
		logging.NewError("error", errors.New("some error"),nil))
	_, err := d.getMetrics.Execute(uuid.New())

	require.Error(d.T(), err)
}


func (d *DatasourceSuite) TestConnection() {
	pluginStr := "datasource/validaction/validaction"
	jsonData := json.RawMessage(`{"url": "http://localhost:9090"}`)
	d.dataSourceRep.On("TestConnection", mock.Anything, mock.Anything).Return( nil)
	err := d.testConnection.Execute(pluginStr, jsonData)

	require.Nil(d.T(), err)
}

func (d *DatasourceSuite) TestConnectionError() {
	pluginStr := "datasource/validaction/validaction"
	jsonData := json.RawMessage(`{"url": "http://localhost:9090"}`)
	d.dataSourceRep.On("TestConnection", mock.Anything, mock.Anything).Return(
		logging.NewError("error", errors.New("some error"),nil))
	err := d.testConnection.Execute(pluginStr, jsonData)

	require.NotNil(d.T(), err)
}