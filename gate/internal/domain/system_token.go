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
	Workspaces  []string
	TokenValue  string
	CreatedAt   *time.Time
	RevokedAt   *time.Time
	LastUsedAt  *time.Time
	Author      string
}
