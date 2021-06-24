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
	"github.com/ZupIT/charlescd/compass/internal/domain"
	datasource2 "github.com/ZupIT/charlescd/compass/internal/use_case/datasource"
	"github.com/ZupIT/charlescd/compass/internal/util"
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
	d.findAllDatasources = datasource2.NewFindAllDatasource(d.dataSourceRep)
}


func TestSuite(t *testing.T) {
	suite.Run(t, new(DatasourceSuite))
}


func (d *DatasourceSuite) TestFindAllByWorkspace() {
	var datasources []domain.Datasource
	datasources[0] = domain.Datasource{BaseModel: util.BaseModel{ID: uuid.New()}}
	datasources[1] = domain.Datasource{BaseModel: util.BaseModel{ID: uuid.New()}}

	d.dataSourceRep.On("FindAllByWorkspace", mock.Anything).Return(datasources, nil)
	a, err := d.findAllDatasources.Execute(uuid.New())

	require.NotNil(d.T(), a)
	require.Nil(d.T(), err)
}
/*
func (d *DatasourceSuite) TestFindAllByWorkspaceError() {
	d.DB.Close()
	_, err := d.repository.FindAllByWorkspace(uuid.New())

	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestSaveDatasource() {
	dataSourceStruct := datasource2.Request{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	res, err := d.repository.Save(dataSourceStruct)

	require.Nil(d.T(), err)

	dataSourceStruct.BaseModel = res.BaseModel
	require.Equal(d.T(), dataSourceStruct.BaseModel, res.BaseModel)
	require.Equal(d.T(), dataSourceStruct.WorkspaceID, res.WorkspaceID)
	require.Equal(d.T(), dataSourceStruct.PluginSrc, res.PluginSrc)
}

func (d *DatasourceSuite) TestSaveDatasourceError() {
	dataSourceStruct := datasource2.Request{
		Name:        "DataTest",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8080"}`),
		WorkspaceID: uuid.New(),
		DeletedAt:   nil,
	}

	d.DB.Close()
	_, err := d.repository.Save(dataSourceStruct)
	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestDelete() {
	workspaceId := uuid.New()
	dataSource := datasource2.DataSource{
		Name:        "DataTest2",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	d.DB.Create(&dataSource)

	err := d.repository.Delete(dataSource.ID.String())
	require.Nil(d.T(), err)
}

func (d *DatasourceSuite) TestFindByIdNotFoundError() {
	_, err := d.repository.FindById("any-id")
	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestDeleteError() {
	d.DB.Close()
	err := d.repository.Delete("any-id")
	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestGetMetricsNotFoundError() {
	datasourceId := uuid.New().String()
	_, err := d.repository.GetMetrics(datasourceId)

	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestGetMetricsError() {
	workspaceId := uuid.New()
	dataSource := datasource2.DataSource{
		Name:        "DataTest2",
		PluginSrc:   "prometheus",
		Data:        json.RawMessage(`{"url": "localhost:8090"}`),
		WorkspaceID: workspaceId,
		DeletedAt:   nil,
	}

	d.DB.Create(&dataSource)

	_, err := d.repository.GetMetrics(dataSource.ID.String())

	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestConnectionJsonError() {
	jsonData := json.RawMessage(`{"data": "prometheus"}`)
	err := d.repository.TestConnection("datasource/errorconnection/errorconnection", jsonData)

	require.NotNil(d.T(), err)
}

func (d *DatasourceSuite) TestConnection() {
	jsonData := json.RawMessage(`{"url": "http://localhost:9090"}`)
	err := d.repository.TestConnection("datasource/validaction/validaction", jsonData)

	require.Nil(d.T(), err)
}

func (d *DatasourceSuite) TestConnectionPluginDirError() {
	os.Setenv("PLUGINS_DIR", "/dist")

	jsonData := json.RawMessage(`{"url": "http://localhost:9090"}`)
	err := d.repository.TestConnection("datasource/validaction/validaction", jsonData)

	require.NotNil(d.T(), err)
}
*/