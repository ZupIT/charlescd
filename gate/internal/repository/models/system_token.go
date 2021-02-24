package models

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
	"time"
)

type SystemToken struct {
	ID          uuid.UUID
	Name        string
	Revoked     bool
	Permissions []Permission
	CreatedAt   time.Time
	RevokedAt   time.Time
	LastUsedAt  time.Time
	Author      User
}

func SystemTokenDomainToModel(systemToken domain.SystemToken) SystemToken {
	return SystemToken{
		ID:          systemToken.ID,
		Name:        systemToken.Name,
		Revoked:     systemToken.Revoked,
		Permissions: PermissionsDomainToModels(systemToken.Permissions),
		CreatedAt:   systemToken.CreatedAt,
		RevokedAt:   systemToken.RevokedAt,
		LastUsedAt:  systemToken.LastUsedAt,
		Author:      UserDomainToModel(systemToken.Author),
	}
}
