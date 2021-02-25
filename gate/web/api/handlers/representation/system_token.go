package representation

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
	"time"
)

type SystemTokenRequest struct {
	Name string `json:"name" validate:"required,notblank"`
	Permissions []string `json:"permissions" validate:"required,notnull"`
	Author string `json:"author" validate:"required,notblank"`
}

type SystemTokenResponse struct {
	ID uuid.UUID `json:"id"`
	Name string `json:"name"`
	Permissions []PermissionResponse `json:"permissions"`
	CreatedAt time.Time `json:"created_at"`
	RevokedAt time.Time `json:"revoked_at"`
	LastUsedAt time.Time `json:"last_used_at"`
	Author string `json:"author"`
}

func (systemTokenRequest SystemTokenRequest) SystemTokenToDomain(author domain.User) domain.SystemToken {
	return domain.SystemToken{
		ID:          uuid.New(),
		Name:        systemTokenRequest.Name,
		Revoked:     false,
		Permissions: []domain.Permission{},
		CreatedAt:   time.Now(),
		RevokedAt:   time.Time{},
		LastUsedAt:  time.Time{},
		Author:      author,
	}
}

func SystemTokenToResponse(systemToken domain.SystemToken) SystemTokenResponse {
	return SystemTokenResponse{
		ID: systemToken.ID,
		Name: systemToken.Name,
		Permissions: PermissionsToResponse(systemToken.Permissions),
		CreatedAt: systemToken.CreatedAt,
		RevokedAt: systemToken.RevokedAt,
		LastUsedAt: systemToken.LastUsedAt,
		Author: systemToken.Author.Email,
	}
}