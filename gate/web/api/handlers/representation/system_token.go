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

package representation

import (
	"time"

	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/use_case/systoken"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/google/uuid"
)

type SystemTokenRequest struct {
	Name          string   `json:"name" validate:"required,notblank"`
	Permissions   []string `json:"permissions" validate:"dive,notblank"`
	Workspaces    []string `json:"workspaces" validate:"required, notblank, min=1" `
	AllWorkspaces bool     `json:"allWorkspaces"`
}

type SystemTokenResponse struct {
	ID            uuid.UUID                `json:"id"`
	Name          string                   `json:"name"`
	Permissions   []string                 `json:"permissions"`
	Workspaces    []domain.SimpleWorkspace `json:"workspaces"`
	AllWorkspaces bool                     `json:"allWorkspaces"`
	Revoked       bool                     `json:"revoked"`
	Token         string                   `json:"token,omitempty"`
	CreatedAt     *time.Time               `json:"created_at"`
	RevokedAt     *time.Time               `json:"revoked_at"`
	LastUsedAt    *time.Time               `json:"last_used_at"`
	Author        string                   `json:"author"`
}

type PageSystemTokenResponse struct {
	Content    []SystemTokenResponse `json:"content"`
	Page       int                   `json:"page"`
	Size       int                   `json:"size"`
	Last       bool                  `json:"last"`
	TotalPages int                   `json:"totalPages"`
}

type RegenerateTokenResponse struct {
	Token string `json:"token"`
}

func (systemTokenRequest SystemTokenRequest) RequestToInput() systoken.CreateSystemTokenInput {
	return systoken.CreateSystemTokenInput{
		Name:          systemTokenRequest.Name,
		Permissions:   systemTokenRequest.Permissions,
		Workspaces:    systemTokenRequest.Workspaces,
		AllWorkspaces: systemTokenRequest.AllWorkspaces,
	}
}

func DomainToResponse(systemToken domain.SystemToken, tokenValue string) SystemTokenResponse {
	return SystemTokenResponse{
		ID:            systemToken.ID,
		Name:          systemToken.Name,
		Permissions:   mapper.GetPermissionModelsName(systemToken.Permissions),
		Workspaces:    systemToken.Workspaces,
		AllWorkspaces: systemToken.AllWorkspaces,
		Revoked:       systemToken.Revoked,
		Token:         tokenValue,
		CreatedAt:     systemToken.CreatedAt,
		RevokedAt:     systemToken.RevokedAt,
		LastUsedAt:    systemToken.LastUsedAt,
		Author:        systemToken.Author,
	}
}

func DomainsToResponses(systemTokens []domain.SystemToken) []SystemTokenResponse {
	var systemTokenResponse []SystemTokenResponse
	for _, permission := range systemTokens {
		systemTokenResponse = append(systemTokenResponse, DomainToResponse(permission, ""))
	}
	return systemTokenResponse
}

func DomainsToPageResponse(systemTokens []domain.SystemToken, page domain.Page) PageSystemTokenResponse {
	return PageSystemTokenResponse{
		Content:    DomainsToResponses(systemTokens),
		Page:       page.PageNumber,
		Size:       len(systemTokens),
		Last:       page.IsLast(),
		TotalPages: page.TotalPages(),
	}
}

func ToRegenerateTokenResponse(token string) RegenerateTokenResponse {
	return RegenerateTokenResponse{Token: token}
}
