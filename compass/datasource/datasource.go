package datasource

import (
	"compass/pkg/datasource"
	"compass/util"
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

func (main Main) GetMetrics() (datasource.MetricList, error) {

}
