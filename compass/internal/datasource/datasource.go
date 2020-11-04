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
	"compass/internal/util"
	"compass/pkg/datasource"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"io"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type DataSource struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginSrc   string          `json:"pluginSrc"`
	Health      bool            `json:"healthy"`
	Data        json.RawMessage `json:"data" gorm:"type:jsonb"`
	WorkspaceID uuid.UUID       `json:"workspaceId"`
	DeletedAt   *time.Time      `json:"-"`
}

func (main Main) Validate(dataSource DataSource) []util.ErrorUtil {
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

func (main Main) Parse(dataSource io.ReadCloser) (DataSource, error) {
	var newDataSource *DataSource
	err := json.NewDecoder(dataSource).Decode(&newDataSource)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, dataSource)
		return DataSource{}, err
	}
	return *newDataSource, nil
}

func (main Main) FindAllByWorkspace(workspaceID string, health string) ([]DataSource, error) {
	var dataSources []DataSource
	var db *gorm.DB

	if health == "" {
		db = main.db.Where("workspace_id = ?", workspaceID).Find(&dataSources)
	} else {
		healthValue, _ := strconv.ParseBool(health)
		db = main.db.Where("workspace_id = ? AND health = ?", workspaceID, healthValue).Find(&dataSources)
	}

	if db.Error != nil {
		logger.Error(util.FindDatasourceError, "FindAllByWorkspace", db.Error, "WorkspaceId = "+workspaceID)
		return []DataSource{}, db.Error
	}

	return dataSources, nil
}

func (main Main) FindById(id string) (DataSource, error) {
	dataSource := DataSource{}
	result := main.db.Where("id = ?", id).First(&dataSource)
	if result.Error != nil {
		logger.Error(util.FindDatasourceError, "FindActionById", result.Error, "Id = "+id)
		return DataSource{}, result.Error
	}
	return dataSource, nil
}

func (main Main) FindHealthByWorkspaceId(workspaceID string) (DataSource, error) {
	dataSource := DataSource{}
	result := main.db.Where("workspace_id = ? AND health = ?", workspaceID, true).First(&dataSource)
	if result.Error != nil {
		logger.Error(util.FindDatasourceError, "FindHealthByWorkspaceId", result.Error, "workspaceID = "+workspaceID)
		return DataSource{}, result.Error
	}
	return dataSource, nil
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

func (main Main) Save(dataSource DataSource) (DataSource, error) {
	if dataSource.Health == true {
		if hasHealth, err := main.VerifyHealthAtWorkspace(dataSource.WorkspaceID.String()); err != nil || hasHealth {
			logger.Error(util.ExistingDatasourceHealthError, "SaveAction", err, "Health=true")
			return DataSource{}, errors.New("Cannot set as Health")
		}
	}

	db := main.db.Create(&dataSource)
	if db.Error != nil {
		logger.Error(util.DatasourceSaveError, "SaveAction", db.Error, dataSource)
		return DataSource{}, db.Error
	}
	return dataSource, nil
}
