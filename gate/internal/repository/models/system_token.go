package models

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"time"
)

type SystemToken struct {
	ID          uuid.UUID
	Name        string
	Revoked     bool
	Permissions []Permission `gorm:"many2many:system_tokens_permissions;"`
	Workspaces  pq.StringArray `gorm:"type:varchar(36)[]"`
	CreatedAt   time.Time
	RevokedAt   time.Time
	LastUsedAt  time.Time
	Author      string `gorm:"column:author_email"`
}

func SystemTokenDomainToModel(systemToken domain.SystemToken, permissions []domain.Permission) SystemToken {
	return SystemToken{
		ID:          systemToken.ID,
		Name:        systemToken.Name,
		Revoked:     systemToken.Revoked,
		Permissions: systemToken.Permissions,
		Workspaces:  systemToken.Workspaces,
		CreatedAt:   systemToken.CreatedAt,
		RevokedAt:   systemToken.RevokedAt,
		LastUsedAt:  systemToken.LastUsedAt,
		Author:      systemToken.Author,
	}
}
