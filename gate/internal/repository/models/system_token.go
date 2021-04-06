package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/pkosilo/gorm-crypto"
	"time"
)

type SystemToken struct {
	ID          uuid.UUID
	Name        string
	Revoked     bool
	Permissions []Permission              `gorm:"many2many:system_tokens_permissions;"`
	Workspaces  pq.StringArray            `gorm:"type:varchar(36)[]"`
	Token       gormcrypto.EncryptedValue `gorm:"->:false;<-:create"`
	CreatedAt   *time.Time
	RevokedAt   *time.Time
	LastUsedAt  *time.Time
	Author      string `gorm:"column:author_email"`
}
