package models

import "time"

type UserGroup struct {
	Id        string
	Name      string
	Author    User `gorm:"column:user_id"`
	CreatedAt *time.Time
	Users     []User `gorm:"many2many:user_groups_users;"`
}
