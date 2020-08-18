package plugin

import (
	"compass/internal/configuration"
	"compass/internal/util"
	"encoding/json"
	"errors"
	"io"
	"path/filepath"
	"plugin"
)

type Plugin struct {
	util.BaseModel
	Name string `json:"name"`
	Src  string `json:"src"`
}

func (plugin Plugin) Validate() []error {
	ers := make([]error, 0)

	if plugin.Name == "" {
		ers = append(ers, errors.New("Name is required"))
	}

	if plugin.Src == "" {
		ers = append(ers, errors.New("Source path is required"))
	}

	return ers
}

func (main Main) Parse(plugin io.ReadCloser) (Plugin, error) {
	var newPlugin *Plugin
	err := json.NewDecoder(plugin).Decode(&newPlugin)
	if err != nil {
		return Plugin{}, err
	}
	return *newPlugin, nil
}

func (main Main) FindAll() ([]Plugin, error) {
	var plugins []Plugin
	db := main.db.Find(&plugins)
	if db.Error != nil {
		return []Plugin{}, db.Error
	}
	return plugins, nil
}

func (main Main) Save(plugin Plugin) (Plugin, error) {
	db := main.db.Create(&plugin)
	if db.Error != nil {
		return Plugin{}, db.Error
	}
	return plugin, nil
}

func (main Main) FindById(id string) (Plugin, error) {
	plugin := Plugin{}
	db := main.db.Where("id = ?", id).First(&plugin)
	if db.Error != nil {
		return Plugin{}, db.Error
	}
	return plugin, nil
}

func (main Main) GetPluginByID(id string) (*plugin.Plugin, error) {
	pluginsPath := configuration.GetConfiguration("PLUGINS_DIR")

	pluginResult, err := main.FindById(id)
	if err != nil {
		return nil, err
	}

	return plugin.Open(filepath.Join(pluginsPath, pluginResult.Src+".so"))
}

func (main Main) Update(id string, plugin Plugin) (Plugin, error) {
	db := main.db.Table("plugins").Where("id = ?", id).Update(&plugin)
	if db.Error != nil {
		return Plugin{}, db.Error
	}
	return plugin, nil
}

func (main Main) Remove(id string) error {
	db := main.db.Where("id = ?", id).Delete(Plugin{})
	if db.Error != nil {
		return db.Error
	}
	return nil
}
