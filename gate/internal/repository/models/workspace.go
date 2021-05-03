package models

import (
	"github.com/google/uuid"
	"time"
)

type Workspace struct {
	ID                      uuid.UUID
	Name                    string
	Author                  uuid.UUID `gorm:"column:user_id"`
	CreatedAt               *time.Time
	UserGroups              []UserGroup `gorm:"many2many:workspaces_user_groups;"`
	Status                  string
	RegistryConfigurationId uuid.UUID
	CircleMatcherUrl        string
	GitConfigurationId      uuid.UUID
	CdConfigurationId       uuid.UUID
	MetricConfigurationId   uuid.UUID
}
