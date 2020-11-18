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

package datasource

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"io"
	"strconv"
	"time"

	"github.com/google/uuid"
)

type DataSource struct {
	util.BaseModel
	Name        string     `json:"name"`
	PluginSrc   string     `json:"pluginSrc"`
	Health      bool       `json:"healthy"`
	Data        []byte     `json:"data" gorm:"type:bytea"`
	WorkspaceID uuid.UUID  `json:"workspaceId"`
	DeletedAt   *time.Time `json:"-"`
}

type Request struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginSrc   string          `json:"pluginSrc"`
	Health      bool            `json:"healthy"`
	Data        json.RawMessage `json:"data"`
	WorkspaceID uuid.UUID       `json:"workspaceId"`
	DeletedAt   *time.Time      `json:"-"`
}

type Response struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginSrc   string          `json:"pluginSrc"`
	Health      bool            `json:"healthy"`
	Data        json.RawMessage `json:"data"`
	WorkspaceID uuid.UUID       `json:"workspaceId"`
	DeletedAt   *time.Time      `json:"-"`
}

func (main Main) Validate(dataSource Request) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if dataSource.Name == "" {
		ers = append(ers, util.ErrorUtil{Field: "name", Error: errors.New("Name is required").Error()})
	}

	if dataSource.PluginSrc == "" {
		ers = append(ers, util.ErrorUtil{Field: "pluginSrc", Error: errors.New("Plugin src is required").Error()})
	}

	if dataSource.Data == nil || len(dataSource.Data) == 0 {
		ers = append(ers, util.ErrorUtil{Field: "data", Error: errors.New("Data is required").Error()})
	}

	if dataSource.Name != "" && len(dataSource.Name) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "name", Error: errors.New("100 Maximum length in Name").Error()})
	}

	if dataSource.PluginSrc != "" && len(dataSource.PluginSrc) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "pluginSrc", Error: errors.New("100 Maximum length in PluginSrc").Error()})
	}

	return ers
}

func (main Main) Parse(dataSource io.ReadCloser) (Request, error) {
	var newDataSource *Request
	err := json.NewDecoder(dataSource).Decode(&newDataSource)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseDatasource", err, dataSource)
		return Request{}, err
	}
	return *newDataSource, nil
}

func (main Main) FindAllByWorkspace(workspaceID string, health string) ([]Response, error) {
	var rows *sql.Rows
	var err error
	dataSources := make([]Response, 0)

	if health == "" {
		rows, err = main.db.Raw(workspaceDatasourceQuery, workspaceID).Rows()
	} else {
		healthValue, _ := strconv.ParseBool(health)
		rows, err = main.db.Raw(workspaceAndHealthDatasourceQuery, workspaceID, healthValue).Rows()
	}
	if err != nil {
		logger.Error(util.FindDatasourceError, "FindAllByWorkspace", err, "WorkspaceId = "+workspaceID)
		return []Response{}, err
	}

	for rows.Next() {
		var dataSource DataSource

		err = main.db.ScanRows(rows, &dataSource)
		if err != nil {
			logger.Error(util.FindDatasourceError, "FindAllByWorkspace", err, "WorkspaceId = "+workspaceID)
			return []Response{}, err
		}

		dataSources = append(dataSources, dataSource.toResponse())
	}

	return dataSources, nil
}

func (main Main) FindById(id string) (Response, error) {
	dataSource := DataSource{}
	row := main.db.Raw(datasourceDecryptedQuery, id).Row()

	dbError := row.Scan(&dataSource.ID, &dataSource.Name, &dataSource.CreatedAt, &dataSource.Data,
		&dataSource.WorkspaceID, &dataSource.Health, &dataSource.DeletedAt, &dataSource.PluginSrc)
	if dbError != nil {
		logger.Error(util.FindDatasourceError, "FindDatasourceById", dbError, id)
		return Response{}, dbError
	}

	return dataSource.toResponse(), nil
}

func (main Main) FindHealthByWorkspaceId(workspaceID string) (Response, error) {
	dataSource := DataSource{}
	row := main.db.Raw(decryptedWorkspaceAndHealthDatasourceQuery, workspaceID, true).Row()

	dbError := row.Scan(&dataSource.ID, &dataSource.Name, &dataSource.CreatedAt, &dataSource.Data,
		&dataSource.WorkspaceID, &dataSource.Health, &dataSource.DeletedAt, &dataSource.PluginSrc)
	if dbError != nil {
		logger.Error(util.FindDatasourceError, "FindHealthByWorkspaceId", dbError, "workspaceID = "+workspaceID)
		return Response{}, dbError
	}

	return dataSource.toResponse(), nil
}

func (main Main) Delete(id string) error {
	db := main.db.Model(&DataSource{}).Where("id = ?", id).Delete(&DataSource{})
	if db.Error != nil {
		logger.Error(util.DeleteDatasourceError, "DeleteAction", db.Error, "Id = "+id)
		return db.Error
	}

	return nil
}

func (main Main) GetMetrics(dataSourceID, name string) (datasource.MetricList, error) {
	dataSourceResult, err := main.FindById(dataSourceID)
	if err != nil {
		return datasource.MetricList{}, errors.New("Not found data source: " + dataSourceID)
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		logger.Error(util.OpenPluginGetMetricsError, "GetMetrics", err, plugin)
		return datasource.MetricList{}, err
	}

	getList, err := plugin.Lookup("GetMetrics")
	if err != nil {
		logger.Error(util.PluginLookupError, "GetMetrics", err, plugin)
		return datasource.MetricList{}, err
	}

	configurationData, _ := json.Marshal(dataSourceResult.Data)
	list, err := getList.(func(configurationData []byte) (datasource.MetricList, error))(configurationData)
	if err != nil {
		logger.Error(util.PluginListError, "GetMetrics", err, configurationData)
		return datasource.MetricList{}, err
	}

	return list, nil
}

func (main Main) TestConnection(pluginSrc string, datasourceData json.RawMessage) error {
	plugin, err := main.pluginMain.GetPluginBySrc(pluginSrc)
	if err != nil {
		logger.Error(util.OpenPluginGetMetricsError, "TestConnection", err, plugin)
		return err
	}

	testConnection, err := plugin.Lookup("TestConnection")
	if err != nil {
		logger.Error(util.PluginLookupError, "TestConnection", err, plugin)
		return err
	}

	configurationData, _ := json.Marshal(datasourceData)
	err = testConnection.(func(configurationData []byte) error)(configurationData)
	if err != nil {
		logger.Error(util.PluginListError, "TestConnection", err, configurationData)
		return err
	}

	return nil
}

func (main Main) VerifyHealthAtWorkspace(workspaceId string) (bool, error) {
	var count int8
	result := main.db.Table("data_sources").Where("workspace_id = ? AND health = true AND deleted_at IS NULL", workspaceId).Count(&count)
	if result.Error != nil {
		logger.Error(util.VerifyDatasourceHealthError, "VerifyHealthAtWorkspace", result.Error, "WorkspaceId: "+workspaceId)
		return false, result.Error
	}

	return count != 0, nil
}

func (main Main) Save(dataSource Request) (Response, error) {
	if dataSource.Health == true {
		if hasHealth, err := main.VerifyHealthAtWorkspace(dataSource.WorkspaceID.String()); err != nil || hasHealth {
			logger.Error(util.ExistingDatasourceHealthError, "SaveAction", err, "Health=true")
			return Response{}, errors.New("Cannot set as Health")
		}
	}
	id := uuid.New().String()
	entity := DataSource{}

	row := main.db.Exec(datasourceInsert(id, dataSource.Name, dataSource.PluginSrc, dataSource.Data, dataSource.Health, dataSource.WorkspaceID)).
		Raw(datasourceSaveQuery, id).
		Row()

	dbError := row.Scan(&entity.ID, &entity.Name, &entity.CreatedAt,
		&entity.WorkspaceID, &entity.Health, &entity.DeletedAt, &entity.PluginSrc)
	if dbError != nil {
		logger.Error(util.DatasourceSaveError, "SaveDatasource", dbError, id)
		return Response{}, dbError
	}

	return entity.toResponse(), nil
}

func datasourceInsert(id, name, pluginSrc string, data []byte, health bool, workspaceId uuid.UUID) string {
	return fmt.Sprintf(`INSERT INTO data_sources (id, name, data, workspace_id, health, deleted_at, plugin_src)
							VALUES ('%s', '%s', PGP_SYM_ENCRYPT('%s', 'MAYCON', 'cipher-algo=aes256'), '%s', %t, null, '%s');`,
		id, name, data, workspaceId, health, pluginSrc)
}

func (entity DataSource) toResponse() Response {
	return Response{
		BaseModel:   entity.BaseModel,
		Name:        entity.Name,
		PluginSrc:   entity.PluginSrc,
		Health:      entity.Health,
		Data:        entity.Data,
		WorkspaceID: entity.WorkspaceID,
		DeletedAt:   entity.DeletedAt,
	}
}
