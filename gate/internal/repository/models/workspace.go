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
	RegistryConfigurationId string
	CircleMatcherUrl        string
	GitConfigurationId      string
	CdConfigurationId       string
	MetricConfigurationId   string
}
