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

package action

import (
	"encoding/json"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type CreateAction interface {
	Execute(datasource domain.Action) (domain.Action, error)
}

type createAction struct {
	actionRepository repository.ActionRepository
	pluginRepository repository.PluginRepository
}

func NewCreateAction(a repository.ActionRepository, p repository.PluginRepository) CreateAction {
	return createAction{
		actionRepository: a,
		pluginRepository: p,
	}
}

func (s createAction) Execute(action domain.Action) (domain.Action, error) {

	if action.UseDefault {
		action.Configuration = json.RawMessage(fmt.Sprintf(`{"mooveUrl": "%s"}`, configuration.Get("MOOVE_PATH")))
	}

	plugin, err := s.pluginRepository.GetPluginBySrc(fmt.Sprintf("action/%s/%s", action.Type, action.Type))
	if err != nil {
		return domain.Action{}, logging.WithOperation(err, "createAction.Execute")
	}

	pluginErrs, err := plugin.Lookup("ValidateActionConfiguration")
	if err != nil {
		return domain.Action{}, logging.NewError("invalid data", err, map[string]string{"field": "type"}, "createAction.Execute.Lookup")
	}

	configErrs := pluginErrs.(func(actionConfig []byte) []error)(action.Configuration)
	if len(configErrs) > 0 {
		for _, err := range configErrs {
			return domain.Action{}, logging.NewError("invalid data", err, map[string]string{"field": "type"}, "createAction.Execute.ValidateActionConfiguration")
		}
	}

	savedAction, err := s.actionRepository.SaveAction(action)
	if err != nil {
		return domain.Action{}, logging.WithOperation(err, "createAction.Execute")
	}

	return savedAction, nil
}
