package models

import (
	"github.com/google/uuid"
	"time"
)

type SystemToken struct {
	ID          uuid.UUID
	Name        string
	Revoked     bool
	Permissions []Permission `gorm:"-"`
	CreatedAt   time.Time
	RevokedAt   time.Time
	LastUsedAt  time.Time
	Author      User `gorm:"-"`
}