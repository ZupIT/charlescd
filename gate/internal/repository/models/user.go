package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"time"
)

type User struct {
	ID         uuid.UUID
	Name       string
	PhotoUrl   string
	Email      string
	IsRoot     bool
	CreatedAt  time.Time
	Workspaces pq.StringArray `gorm:"type:varchar(36)[]"`
}
