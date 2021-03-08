package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
	"time"
)

type SystemTokenRequest struct {
	Name string `json:"name" validate:"required,notblank"`
	Permissions []string `json:"permissions" validate:"min=1,dive,notblank"`
	Workspaces []string `json:"workspaces" validate:"required"`
	Author string `json:"author" validate:"required,notblank"`
}

type SystemTokenResponse struct {
	ID uuid.UUID `json:"id"`
	Name string `json:"name"`
	Permissions []string `json:"permissions"`
	Workspaces []string `json:"workspaces"`
	CreatedAt *time.Time `json:"created_at"`
	RevokedAt *time.Time `json:"revoked_at"`
	LastUsedAt *time.Time `json:"last_used_at"`
	Author string `json:"author"`
}

func (systemTokenRequest SystemTokenRequest) RequestToDomain() domain.SystemToken {
	createdAt := time.Now()
	return domain.SystemToken{
		ID:          uuid.New(),
		Name:        systemTokenRequest.Name,
		Revoked:     false,
		Permissions: systemTokenRequest.Permissions,
		Workspaces: systemTokenRequest.Workspaces,
		CreatedAt:   &createdAt,
		RevokedAt:   &time.Time{},
		LastUsedAt:  &time.Time{},
		Author: systemTokenRequest.Author,
	}
}

func DomainToResponse(systemToken domain.SystemToken) SystemTokenResponse {
	return SystemTokenResponse{
		ID: systemToken.ID,
		Name: systemToken.Name,
		Permissions: systemToken.Permissions,
		Workspaces: systemToken.Workspaces,
		CreatedAt: systemToken.CreatedAt,
		RevokedAt: systemToken.RevokedAt,
		LastUsedAt: systemToken.LastUsedAt,
		Author: systemToken.Author,
	}
}