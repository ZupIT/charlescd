package models

import (
	"time"

	"github.com/google/uuid"
)

type SystemToken struct {
	ID          uuid.UUID
	Name        string
	Revoked     bool
	Permissions []Permission `gorm:"-"`
	CreatedAt   *time.Time
	RevokedAt   *time.Time
	LastUsedAt  *time.Time
	AuthorEmail string
}
