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

package repository

import (
	"encoding/json"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"io/ioutil"
	"path/filepath"
	"plugin"
)

type PluginRepository interface {
	FindAll(category string) ([]domain.Plugin, error)
	GetPluginBySrc(id string) (*plugin.Plugin, error)
}

type pluginRepository struct {
}

func NewPluginRepository() PluginRepository {
	return pluginRepository{}
}

func (main pluginRepository) FindAll(category string) ([]domain.Plugin, error) {
	if category != "" {
		return getPluginsDirectoriesByCategory(category)
	}

	var plugins []domain.Plugin
	pluginsDir := configuration.Get("PLUGINS_DIR")

	categories, err := ioutil.ReadDir(pluginsDir)
	if err != nil {
		return []domain.Plugin{}, logging.NewError("Find error", err, nil, "PluginRepository.FindAll.ReadDir")
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

func (main pluginRepository) GetPluginBySrc(src string) (*plugin.Plugin, error) {
	pluginsDir := configuration.Get("PLUGINS_DIR")

	p, err := plugin.Open(filepath.Join(fmt.Sprintf("%s/%s.so", pluginsDir, src)))
	if err != nil {
		return nil, logging.NewError("error finding plugin", err, map[string]string{pluginsDir: src}, "PluginRepository.GetPluginBySrc.Open")
	}

	return p, nil
}

func getPluginsDirectoriesByCategory(categoryName string) ([]domain.Plugin, error) {
	var plugins []models.Plugin
	pluginsDir := configuration.Get("PLUGINS_DIR")

	ps, err := ioutil.ReadDir(fmt.Sprintf("%s/%s", pluginsDir, categoryName))
	if err != nil {
		return []domain.Plugin{}, logging.NewError("Cant read plugin dir", err, nil, "PluginRepository.getPluginsDirectoriesByCategory.ReadDir")
	}

	for _, p := range ps {
		readme, err := ioutil.ReadFile(fmt.Sprintf("%s/%s/%s/readme.json", pluginsDir, categoryName, p.Name()))
		if err != nil {
			return []domain.Plugin{}, logging.NewError("Readme error", err, nil, "PluginRepository.getPluginsDirectoriesByCategory.ReadFile")
		}

		newPlugin := models.Plugin{}
		err = json.Unmarshal(readme, &newPlugin)
		if err != nil {
			return []domain.Plugin{}, logging.NewError("Unmarshall error", err, nil, "PluginRepository.getPluginsDirectoriesByCategory.Unmarshal")
		}

		newPlugin.Src = fmt.Sprintf("%s/%s/%s", categoryName, p.Name(), p.Name())
		newPlugin.Category = categoryName
		plugins = append(plugins, newPlugin)
	}

	return mapper.PluginModelToDomains(plugins), nil
}
