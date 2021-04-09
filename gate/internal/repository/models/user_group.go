package models

import "time"

type UserGroup struct {
	id        string
	name      string
	author    User `gorm:"column:user_id"`
	createdAt *time.Time
	users     []User `gorm:"many2many:user_groups_users;"`
}
