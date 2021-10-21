/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package plugin

import (
	"encoding/json"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"io/ioutil"
	"path/filepath"
	"plugin"
)

type Input struct {
	Name     string `json:"name"`
	Label    string `json:"label"`
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type InputParameters map[string]interface{}

type Plugin struct {
	ID              string          `json:"id"`
	Category        string          `json:"category"`
	Name            string          `json:"name"`
	Src             string          `json:"src"`
	Description     string          `json:"description"`
	InputParameters InputParameters `json:"inputParameters"`
}

func getPluginsDirectoriesByCategory(categoryName string) ([]Plugin, errors.Error) {
	var plugins []Plugin
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")
	ps, err := ioutil.ReadDir(fmt.Sprintf("%s/%s", pluginsDir, categoryName))
	if err != nil {
		return []Plugin{}, errors.NewError("Get error", err.Error()).
			WithOperations("getPluginsDirectoriesByCategory.ReadDir")
	}
	plugins = make([]Plugin, 0, len(ps))
	for _, p := range ps {
		readme, err := ioutil.ReadFile(fmt.Sprintf("%s/%s/%s/readme.json", pluginsDir, categoryName, p.Name()))
		if err != nil {
			return []Plugin{}, errors.NewError("Read error", err.Error()).
				WithOperations("getPluginsDirectoriesByCategory.ReadFile")
		}

		newPlugin := Plugin{}
		err = json.Unmarshal(readme, &newPlugin)
		if err != nil {
			return []Plugin{}, errors.NewError("Read error", err.Error()).
				WithOperations("getPluginsDirectoriesByCategory.Unmarshall")
		}

		newPlugin.Src = fmt.Sprintf("%s/%s/%s", categoryName, p.Name(), p.Name())
		newPlugin.Category = categoryName
		plugins = append(plugins, newPlugin)
	}

	return plugins, nil
}

func (main Main) FindAll(category string) ([]Plugin, errors.Error) {
	if category != "" {
		return getPluginsDirectoriesByCategory(category)
	}

	var plugins []Plugin
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")

	categories, err := ioutil.ReadDir(pluginsDir)
	if err != nil {
		return []Plugin{}, errors.NewError("Find error", err.Error()).
			WithOperations("FindAll.ReadDir")
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

func (main Main) GetPluginBySrc(src string) (*plugin.Plugin, errors.Error) {
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")
	p, err := plugin.Open(filepath.Join(fmt.Sprintf("%s/%s.so", pluginsDir, src)))
	if err != nil {
		return nil, errors.NewError("Get error", err.Error()).
			WithOperations("GetPluginBySrc.Open")
	}

	return p, nil
}
