package plugin

import (
	"compass/internal/configuration"
	"compass/internal/util"
	"compass/pkg/logger"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"plugin"
	"strings"

	"github.com/iancoleman/strcase"
)

type Plugin struct {
	Name string `json:"name"`
	Src  string `json:"src"`
}

func (main Main) getPluginSrcByFilename(filename string) string {
	return strings.Split(filename, ".so")[0]
}

func (main Main) getNamePluginByFilename(filename string) string {
	pluginName := main.getPluginSrcByFilename(filename)
	pluginNameDelimited := strcase.ToDelimited(pluginName, ' ')
	return strings.Title(pluginNameDelimited)
}

func (main Main) FindAll() ([]Plugin, error) {
	var plugins []Plugin

	files, err := ioutil.ReadDir(configuration.GetConfiguration("PLUGINS_DIR"))
	if err != nil {
		logger.Error(util.FindPluginError, "FindAll", err, plugins)
		return []Plugin{}, err
	}

	for _, file := range files {
		if strings.Contains(file.Name(), ".so") {
			plugins = append(plugins, Plugin{
				Name: main.getNamePluginByFilename(file.Name()),
				Src:  main.getPluginSrcByFilename(file.Name()),
			})
		}
	}

	return plugins, nil
}

func (main Main) GetPluginBySrc(src string) (*plugin.Plugin, error) {
	pluginsPath := configuration.GetConfiguration("PLUGINS_DIR")
	return plugin.Open(filepath.Join(pluginsPath, fmt.Sprintf("%s.so", src)))
}
