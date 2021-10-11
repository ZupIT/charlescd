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
	RegistryConfigurationID uuid.UUID
	CircleMatcherURL        string
	GitConfigurationID      uuid.UUID
	CdConfigurationID       uuid.UUID
	MetricConfigurationID   uuid.UUID
}
