package models

import (
	"github.com/google/uuid"
	"time"
)

type UserGroup struct {
	ID        string
	Name      string
	Author    uuid.UUID `gorm:"column:user_id"`
	CreatedAt *time.Time
	Users     []User `gorm:"many2many:user_groups_users;"`
}
