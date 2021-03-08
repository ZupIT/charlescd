package domain

import (
	"github.com/google/uuid"
	"time"
)

type SystemToken struct {
	ID          uuid.UUID
	Name        string
	Revoked     bool
	Permissions []string
	Workspaces  []string
	CreatedAt   *time.Time
	RevokedAt   *time.Time
	LastUsedAt  *time.Time
	Author      string
}
