package datasource

import (
	"compass/util"

	"github.com/jinzhu/gorm"
)

type DataSource struct {
	util.BaseModel
	Name        string      `json:"name"`
	PluginID    string      `json:"pluginId"`
	Health      bool        `json:"health"`
	Data        interface{} `json:"data"`
	WorkspaceID string      `json:"workspaceId"`
}

func (main Main) FindAllByWorkspace(workspaceID string) ([]DataSource, error) {
	dataSources := []DataSource{}
	db := main.db.Where("workspace_id = ?", workspaceID).Find(&dataSources)
	if db.Error != nil {
		return []DataSource{}, db.Error
	}
	return dataSources, nil
}

func findById(id string, db *gorm.DB) (DataSource, error) {
	dataSource := DataSource{}
	result := db.Where("id = ?", id).Find(&dataSource)
	if result.Error != nil {
		return DataSource{}, db.Error
	}
	return dataSource, nil
}

func (main Main) Delete(id string, workspaceID string) error {
	db := main.db.Where("id = ? AND worspace_id = ?", id, workspaceID).Delete(DataSource{})
	if db.Error != nil {
		return db.Error
	}
	return nil
}
