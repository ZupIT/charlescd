package models

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type DataSource struct {
	util.BaseModel
	Name        string     `json:"name"`
	PluginSrc   string     `json:"pluginSrc"`
	Data        []byte     `json:"data" gorm:"type:bytea"`
	WorkspaceID uuid.UUID  `json:"workspaceId"`
	DeletedAt   *time.Time `json:"-"`
}
