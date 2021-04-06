package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/google/uuid"
	"time"
)

type SystemTokenRequest struct {
	Name string `json:"name" validate:"required,notblank"`
	Permissions []string `json:"permissions" validate:"min=1,dive,notblank"`
	Workspaces []string `json:"workspaces" validate:"required"`
}

type SystemTokenResponse struct {
	ID          uuid.UUID  `json:"id"`
	Name        string     `json:"name"`
	Permissions []string   `json:"permissions"`
	Workspaces  []string   `json:"workspaces"`
	Revoked     bool       `json:"revoked"`
	Token       string     `json:"token,omitempty"`
	CreatedAt   *time.Time `json:"created_at"`
	RevokedAt   *time.Time `json:"revoked_at"`
	LastUsedAt  *time.Time `json:"last_used_at"`
	Author      string     `json:"author"`
}

type PageSystemTokenResponse struct {
	Content    []SystemTokenResponse `json:"content"`
	Page       int                   `json:"page"`
	Size       int                   `json:"size"`
	Last       bool                  `json:"last"`
	TotalPages int                   `json:"totalPages"`
}

func (systemTokenRequest SystemTokenRequest) RequestToInput() system_token.CreateSystemTokenInput {
	return system_token.CreateSystemTokenInput{
		Name:        systemTokenRequest.Name,
		Permissions: systemTokenRequest.Permissions,
		Workspaces:  systemTokenRequest.Workspaces,
	}
}

func DomainToResponse(systemToken domain.SystemToken, tokenValue string) SystemTokenResponse {
	return SystemTokenResponse{
		ID:          systemToken.ID,
		Name:        systemToken.Name,
		Permissions: mapper.GetPermissionModelsName(systemToken.Permissions),
		Workspaces:  systemToken.Workspaces,
		Revoked:     systemToken.Revoked,
		Token:       tokenValue,
		CreatedAt:   systemToken.CreatedAt,
		RevokedAt:   systemToken.RevokedAt,
		LastUsedAt:  systemToken.LastUsedAt,
		Author:      systemToken.Author,
	}
}

func DomainsToResponses(systemTokens []domain.SystemToken) []SystemTokenResponse {
	var systemTokenResponse []SystemTokenResponse
	for _, permission := range systemTokens {
		systemTokenResponse = append(systemTokenResponse, DomainToResponse(permission, ""))
	}
	return systemTokenResponse
}

func DomainsToPageResponse(systemToken []domain.SystemToken, page domain.Page) PageSystemTokenResponse {
	return PageSystemTokenResponse{
		Content:    DomainsToResponses(systemToken),
		Page:       page.PageNumber,
		Size:       page.PageSize,
		Last:       page.IsLast(),
		TotalPages: page.TotalPages(),
	}
}
