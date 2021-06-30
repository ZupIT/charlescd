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

package repository

import (
	"database/sql"
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/repository/queries"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DatasourceRepository interface {
	FindAllByWorkspace(workspaceID uuid.UUID) ([]domain.Datasource, error)
	FindById(id uuid.UUID) (domain.Datasource, error)
	Save(dataSource domain.Datasource) (domain.Datasource, error)
	Delete(id uuid.UUID) error
	GetMetrics(dataSourceID uuid.UUID) (datasource.MetricList, error)
	TestConnection(pluginSrc string, datasourceData json.RawMessage) error
}

type datasourceRepository struct {
	db         *gorm.DB
	pluginMain PluginRepository
}

func NewDatasourceRepository(db *gorm.DB, pluginMain PluginRepository) DatasourceRepository {
	return datasourceRepository{db, pluginMain}
}

func (main datasourceRepository) FindAllByWorkspace(workspaceID uuid.UUID) ([]domain.Datasource, error) {
	var rows *sql.Rows
	var err error
	dataSources := make([]models.DataSource, 0)

	rows, err = main.db.Raw(queries.WorkspaceDatasourceQuery, workspaceID).Rows()
	if err != nil {
		return []domain.Datasource{}, logging.NewError("Find datasources", err, nil, "DatasourceRepository.FindAllByWorkspace.Rows")
	}

	for rows.Next() {
		var dataSource models.DataSource

		err = main.db.ScanRows(rows, &dataSource)
		if err != nil {
			return []domain.Datasource{}, logging.NewError("Find datasources", err, nil, "DatasourceRepository.FindAllByWorkspace.ScanRows")
		}

		dataSources = append(dataSources, dataSource)
	}

	return mapper.DatasourceModelToDomains(dataSources), nil
}

func (main datasourceRepository) FindById(id uuid.UUID) (domain.Datasource, error) {
	dataSource := models.DataSource{}

	row := main.db.Raw(queries.DatasourceDecryptedQuery(), id).Row()

	dbError := row.Scan(&dataSource.ID, &dataSource.Name, &dataSource.CreatedAt, &dataSource.Data,
		&dataSource.WorkspaceID, &dataSource.DeletedAt, &dataSource.PluginSrc)
	if dbError != nil {
		return domain.Datasource{}, logging.NewError(util.FindDatasourceError, dbError, nil, "DatasourceRepository.FindById.Scan")
	}

	return mapper.DatasourceModelToDomain(dataSource), nil
}

func (main datasourceRepository) Delete(id uuid.UUID) error {
	db := main.db.Model(&models.DataSource{}).Where("id = ?", id).Delete(&models.DataSource{})
	if db.Error != nil {
		return logging.NewError(util.DeleteDatasourceError, db.Error, nil, "DatasourceRepository.Delete")
	}

	return nil
}

func (main datasourceRepository) GetMetrics(dataSourceID uuid.UUID) (datasource.MetricList, error) {
	dataSourceResult, err := main.FindById(dataSourceID)
	if err != nil {
		return datasource.MetricList{}, logging.WithOperation(err, "DatasourceRepository.GetMetrics")
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		return datasource.MetricList{}, logging.WithOperation(err, "DatasourceRepository.GetMetrics")
	}

	getList, lookupErr := plugin.Lookup("GetMetrics")
	if lookupErr != nil {
		return datasource.MetricList{}, logging.NewError("Get Metrics error", lookupErr, nil, "DatasourceRepository.GetMetrics.Lookup")
	}

	configurationData, _ := json.Marshal(dataSourceResult.Data)
	list, getListErr := getList.(func(configurationData []byte) (datasource.MetricList, error))(configurationData)
	if getListErr != nil {
		return datasource.MetricList{}, logging.NewError("Get Metrics error", lookupErr, nil, "DatasourceRepository.GetMetrics.getList")
	}

	return list, nil
}

func (main datasourceRepository) TestConnection(pluginSrc string, datasourceData json.RawMessage) error {
	plugin, err := main.pluginMain.GetPluginBySrc(pluginSrc)
	if err != nil {
		return logging.WithOperation(err, "DatasourceRepository.TestConnection")
	}

	testConnection, lookupError := plugin.Lookup("TestConnection")
	if lookupError != nil {
		return logging.NewError("Test connection error", lookupError, nil, "DatasourceRepository.TestConnection.Lookup")
	}

	configurationData, _ := json.Marshal(datasourceData)
	testConnError := testConnection.(func(configurationData []byte) error)(configurationData)
	if testConnError != nil {
		return logging.NewError("Test connection error", testConnError, nil, "DatasourceRepository.TestConnection.testConnection")
	}

	return nil
}

func (main datasourceRepository) Save(dataSource domain.Datasource) (domain.Datasource, error) {

	id := uuid.New().String()
	entity := models.DataSource{}

	row := main.db.Exec(queries.Insert(id, dataSource.Name, dataSource.PluginSrc, dataSource.Data, dataSource.WorkspaceID)).
		Raw(queries.DatasourceSaveQuery, id).
		Row()

	dbError := row.Scan(&entity.ID, &entity.Name, &entity.CreatedAt,
		&entity.WorkspaceID, &entity.DeletedAt, &entity.PluginSrc)
	if dbError != nil {
		return domain.Datasource{}, logging.NewError(util.DatasourceSaveError, dbError, nil, "DatasourceRepository.Save.Scan")
	}

	return mapper.DatasourceModelToDomain(entity), nil
}
