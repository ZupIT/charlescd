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

package systoken

import (
	"time"

	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/utils"
	"github.com/google/uuid"
)

type CreateSystemTokenInput struct {
	Name          string
	Permissions   []string
	Workspaces    []string
	AllWorkspaces bool
}

func (input CreateSystemTokenInput) InputToDomain() domain.SystemToken {
	createdAt := time.Now()
	return domain.SystemToken{
		ID:            uuid.New(),
		Name:          input.Name,
		Revoked:       false,
		Permissions:   []domain.Permission{},
		Workspaces:    []domain.SimpleWorkspace{},
		AllWorkspaces: input.AllWorkspaces,
		Token:         "",
		CreatedAt:     &createdAt,
		RevokedAt:     nil,
		LastUsedAt:    nil,
		Author:        "",
	}
}

func (input *CreateSystemTokenInput) RemoveDuplicationOnFields() {
	input.Permissions = utils.RemoveDuplicationOnArray(input.Permissions)
	input.Workspaces = utils.RemoveDuplicationOnArray(input.Workspaces)
}
