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

package representation

import "github.com/ZupIT/charlescd/compass/internal/domain"

type InputParameters map[string]interface{}

type PluginResponse struct {
	Id              string          `json:"id"`
	Category        string          `json:"category"`
	Name            string          `json:"name"`
	Src             string          `json:"src"`
	Description     string          `json:"description"`
	InputParameters InputParameters `json:"inputParameters"`
}

func PluginToResponse(plugin domain.Plugin) PluginResponse {
	return PluginResponse{
		Id:              plugin.Id,
		Category:        plugin.Category,
		Name:            plugin.Name,
		Src:             plugin.Src,
		Description:     plugin.Description,
		InputParameters: InputParameters(plugin.InputParameters),
	}
}

func PluginToResponses(plugins []domain.Plugin) []PluginResponse {
	var pluginResponse []PluginResponse
	for _, plugin := range plugins {
		pluginResponse = append(pluginResponse, PluginToResponse(plugin))
	}
	return pluginResponse
}
