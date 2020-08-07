package datasource

import (
	"compass/util"
	"errors"
	"time"

	"github.com/jinzhu/gorm"
)

type DataSource struct {
	util.BaseModel
	Name        string      `json:"name"`
	PluginID    string      `json:"pluginId"`
	Health      bool        `json:"health"`
	Data        interface{} `json:"data"`
	WorkspaceID string      `json:"workspaceId"`
	Deleted     bool
	DeletedAt   time.Time
}

func (main Main) FindAllByWorkspace(workspaceID string) ([]DataSource, error) {
	dataSources := []DataSource{}
	db := main.db.Where("workspace_id = ? AND deleted = false", workspaceID).Find(&dataSources)
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
	db := main.db.Model(DataSource{}).Where("id = ?", id).Update("deleted", true)
	if gorm.IsRecordNotFoundError(db.Error) {
		return errors.New("Not Found")
	}
	if db.Error != nil {
		return db.Error
	}
	return nil
}

func (main Main) Save(dataSource DataSource) error {
	db := main.db.Model(DataSource{}).Where("id = ?", id).Update("deleted", true)
	if gorm.IsRecordNotFoundError(db.Error) {
		return errors.New("Not Found")
	}
	if db.Error != nil {
		return db.Error
	}
	return nil
}
