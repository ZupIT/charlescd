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
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func SystemTokenDomainToModel(systemToken domain.SystemToken) models.SystemToken {
	return models.SystemToken{
		ID:            systemToken.ID,
		Name:          systemToken.Name,
		Revoked:       systemToken.Revoked,
		Permissions:   PermissionsDomainToModels(systemToken.Permissions),
		Workspaces:    WorkspacesDomainToModels(systemToken.Workspaces),
		AllWorkspaces: systemToken.AllWorkspaces,
		Token:         systemToken.Token,
		CreatedAt:     systemToken.CreatedAt,
		RevokedAt:     systemToken.RevokedAt,
		LastUsedAt:    systemToken.LastUsedAt,
		Author:        systemToken.Author,
	}
}

func SystemTokenModelToDomain(systemToken models.SystemToken) domain.SystemToken {
	return domain.SystemToken{
		ID:            systemToken.ID,
		Name:          systemToken.Name,
		Revoked:       systemToken.Revoked,
		Permissions:   PermissionsModelToDomains(systemToken.Permissions),
		Workspaces:    WorkspacesModelToDomains(systemToken.Workspaces),
		AllWorkspaces: systemToken.AllWorkspaces,
		Token:         systemToken.Token,
		CreatedAt:     systemToken.CreatedAt,
		RevokedAt:     systemToken.RevokedAt,
		LastUsedAt:    systemToken.LastUsedAt,
		Author:        systemToken.Author,
	}
}

func SystemTokensModelToDomains(systemToken []models.SystemToken) []domain.SystemToken {
	systemTokens := make([]domain.SystemToken, 0)
	for _, st := range systemToken {
		systemTokens = append(systemTokens, SystemTokenModelToDomain(st))
	}
	return systemTokens
}
