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

package plugin

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type ListPlugins interface {
	Execute(category string) ([]domain.Plugin, error)
}

type listPlugins struct {
	pluginRepository repository.PluginRepository
}

func NewListPlugins(d repository.PluginRepository) ListPlugins {
	return listPlugins{
		pluginRepository: d,
	}
}

func (s listPlugins) Execute(category string) ([]domain.Plugin, error) {
	plugins, err := s.pluginRepository.FindAll(category)
	if err != nil {
		return []domain.Plugin{}, logging.WithOperation(err, "listPlugins.Execute")
	}

	return plugins, nil
}
