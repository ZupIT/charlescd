package domain

import (
	"time"

	"github.com/google/uuid"
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
