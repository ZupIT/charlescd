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
	db := main.db.Where("workspace_id = ?", workspaceID).Find(&dataSources)
	if db.Error != nil {
		return []DataSource{}, db.Error
	}
	return dataSources, nil
}

func (main Main) findById(id string) (DataSource, error) {
	dataSource := DataSource{}
	result := main.db.Where("id = ?", id).First(&dataSource)
	if result.Error != nil {
		return DataSource{}, result.Error
	}
	return dataSource, nil
}

func (main Main) Delete(id string, workspaceID string) error {
	if _, err := main.findById(id); gorm.IsRecordNotFoundError(err) {
		return errors.New("Not found")
	}

	db := main.db.Model(&DataSource{}).Where("id = ?", id).Update(DataSource{Deleted: true, DeletedAt: time.Now()})
	if db.Error != nil {
		return db.Error
	}

	return nil
}
