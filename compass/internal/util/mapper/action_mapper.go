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

package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func ActionModelToDomain(action models.Action) domain.Action {
	return domain.Action{
		BaseModel:     action.BaseModel,
		WorkspaceId:   action.WorkspaceId,
		Nickname:      action.Nickname,
		Type:          action.Type,
		Description:   action.Description,
		UseDefault:    action.UseDefault,
		Configuration: action.Configuration,
	}
}

func ActionModelToDomains(action []models.Action) []domain.Action {
	actions := make([]domain.Action, 0)
	for _, ds := range action {
		actions = append(actions, ActionModelToDomain(ds))
	}
	return actions
}
