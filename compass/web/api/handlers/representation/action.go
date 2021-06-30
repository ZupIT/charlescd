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

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type ActionRequest struct {
	Nickname      string          `json:"nickname" validate:"notblank,max=64"`
	Type          string          `json:"type" validate:"notblank,max=100"`
	Description   string          `json:"description" validate:"notblank,max=64"`
	UseDefault    bool            `json:"useDefaultConfiguration"`
	Configuration json.RawMessage `json:"configuration" validate:"required"`
}

type ActionResponse struct {
	util.BaseModel
	WorkspaceId   uuid.UUID       `json:"workspaceId"`
	Nickname      string          `json:"nickname"`
	Type          string          `json:"type"`
	Description   string          `json:"description"`
	UseDefault    bool            `json:"useDefaultConfiguration" gorm:"-"`
	Configuration json.RawMessage `json:"configuration"`
	DeletedAt     *time.Time      `json:"-"`
}

func (request ActionRequest) RequestToDomain(workspaceId uuid.UUID) domain.Action {
	return domain.Action{
		WorkspaceId:   workspaceId,
		Nickname:      request.Nickname,
		Type:          request.Type,
		Description:   request.Description,
		UseDefault:    request.UseDefault,
		Configuration: request.Configuration,
	}
}

func ActionDomainToResponse(actionDomain domain.Action) ActionResponse {
	return ActionResponse{
		BaseModel:     actionDomain.BaseModel,
		WorkspaceId:   actionDomain.WorkspaceId,
		Nickname:      actionDomain.Nickname,
		Type:          actionDomain.Type,
		Description:   actionDomain.Description,
		UseDefault:    actionDomain.UseDefault,
		Configuration: actionDomain.Configuration,
	}
}

func ActionDomainToResponses(actionDomain []domain.Action) []ActionResponse {
	var actionResponse []ActionResponse
	for _, action := range actionDomain {
		actionResponse = append(actionResponse, ActionDomainToResponse(action))
	}
	return actionResponse
}
