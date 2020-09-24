package plugin

import (
	"compass/internal/configuration"
	"compass/internal/util"
	"compass/pkg/logger"
	"errors"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"plugin"

	"gopkg.in/yaml.v2"
)

type Input struct {
	Name     string `json:"name"`
	Label    string `json:"label"`
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type Plugin struct {
	ID          string  `json:"id"`
	Category    string  `json:"category"`
	Name        string  `json:"name"`
	Src         string  `json:"src"`
	Description string  `json:"description"`
	Health      bool    `json:"health"`
	Inputs      []Input `json:"inputs"`
}

func getPluginsDirectoriesByCategory(categoryName string) ([]Plugin, error) {
	plugins := []Plugin{}
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")
	ps, err := ioutil.ReadDir(fmt.Sprintf("%s/%s", pluginsDir, categoryName))
	if err != nil {
		logger.Error(util.FindPluginError, "FindAll", err, plugins)
		return []Plugin{}, err
	}

	for _, p := range ps {
		readme, err := ioutil.ReadFile(fmt.Sprintf("%s/%s/%s/readme.yaml", pluginsDir, categoryName, p.Name()))
		if err != nil {
			logger.Error(util.FindPluginError, "FindAll", errors.New("Invalid plugin"), plugins)
			return []Plugin{}, err
		}

		newPlugin := Plugin{}
		err = yaml.Unmarshal(readme, &newPlugin)
		if err != nil {
			logger.Error(util.FindPluginError, "FindAll", err, plugins)
			return []Plugin{}, err
		}

		newPlugin.Src = fmt.Sprintf("%s/%s", pluginsDir, p.Name())
		newPlugin.Category = categoryName
		plugins = append(plugins, newPlugin)
	}

	return plugins, err
}

func (main Main) FindAll(category string) ([]Plugin, error) {
	if category != "" {
		return getPluginsDirectoriesByCategory(category)
	}

	plugins := []Plugin{}
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")

	categories, err := ioutil.ReadDir(pluginsDir)
	if err != nil {
		logger.Error(util.FindPluginError, "FindAll", err, plugins)
		return []Plugin{}, err
	}

	for _, category := range categories {
		if category.IsDir() {
			categoryPlugins, err := getPluginsDirectoriesByCategory(category.Name())
			if err != nil {
				return nil, err
			}

			plugins = append(plugins, categoryPlugins...)
		}
	}

	return plugins, nil
}

func (main Main) GetPluginBySrc(src string) (*plugin.Plugin, error) {
	return plugin.Open(filepath.Join(fmt.Sprintf("%s.so", src)))
}
