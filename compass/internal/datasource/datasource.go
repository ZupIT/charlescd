package datasource

import (
	"compass/internal/util"
	"compass/pkg/datasource"
	"encoding/json"
	"errors"
	"io"
	"log"
	"path/filepath"
	"plugin"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type DataSource struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginID    uuid.UUID       `json:"pluginId"`
	Health      bool            `json:"health"`
	Data        json.RawMessage `json:"data" gorm:"type:jsonb"`
	WorkspaceID uuid.UUID       `json:"-"`
	DeletedAt   *time.Time      `json:"-"`
}

func (dataSource DataSource) Validate() []error {
	ers := make([]error, 0)

	if dataSource.Name == "" {
		ers = append(ers, errors.New("Name is required"))
	}

	if dataSource.PluginID == uuid.Nil {
		ers = append(ers, errors.New("PluginId is required"))
	}

	if dataSource.Data == nil || len(dataSource.Data) == 0 {
		ers = append(ers, errors.New("Data is required"))
	}

	return ers
}

func (main Main) Parse(dataSource io.ReadCloser) (DataSource, error) {
	var newDataSource *DataSource
	err := json.NewDecoder(dataSource).Decode(&newDataSource)
	if err != nil {
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
		return []DataSource{}, db.Error
	}

	return dataSources, nil
}

func (main Main) FindById(id string) (DataSource, error) {
	dataSource := DataSource{}
	result := main.db.Where("id = ?", id).First(&dataSource)
	if result.Error != nil {
		return DataSource{}, result.Error
	}
	return dataSource, nil
}

func (main Main) Delete(id string) error {
	if _, err := main.FindById(id); err != nil {
		return err
	}

	db := main.db.Model(&DataSource{}).Where("id = ?", id).Delete(&DataSource{})
	if db.Error != nil {
		return db.Error
	}

	return nil
}

func (main Main) GetMetrics(dataSourceID, name string) (datasource.MetricList, error) {
	pluginsPath := "plugins"

	dataSourceResult, err := main.FindById(dataSourceID)
	if err != nil {
		return datasource.MetricList{}, errors.New("Not found data source: " + dataSourceID)
	}

	pluginResult, err := main.pluginMain.FindById(dataSourceResult.PluginID.String())
	if err != nil {
		return datasource.MetricList{}, errors.New("Not found plugin: " + dataSourceResult.PluginID.String())
	}

	plugin, err := plugin.Open(filepath.Join(pluginsPath, pluginResult.Src+".so"))
	if err != nil {
		return datasource.MetricList{}, err
	}

	getList, err := plugin.Lookup("GetLists")
	if err != nil {
		return datasource.MetricList{}, err
	}

	configurationData, _ := json.Marshal(dataSourceResult.Data)
	list, err := getList.(func(configurationData []byte) (datasource.MetricList, error))(configurationData)
	if err != nil {
		return datasource.MetricList{}, err
	}

	return list, nil
}

func (main Main) verifyHealthAtWorkspace(workspaceId string) (bool, error) {
	var count int8
	result := main.db.Table("data_sources").Where("workspace_id = ? AND health = true AND deleted_at IS NULL", workspaceId).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}

	return count != 0, nil
}

func (main Main) Save(dataSource DataSource) (DataSource, error) {
	if dataSource.Health == true {
		if hasHealth, err := main.verifyHealthAtWorkspace(dataSource.WorkspaceID.String()); err != nil || hasHealth {
			log.Print(err)
			return DataSource{}, errors.New("Cannot set as Health")
		}
	}

	db := main.db.Create(&dataSource)
	if db.Error != nil {
		return DataSource{}, db.Error
	}
	return dataSource, nil
}
