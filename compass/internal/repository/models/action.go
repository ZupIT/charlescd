package models

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type Action struct {
	util.BaseModel
	WorkspaceId   uuid.UUID  `json:"workspaceId"`
	Nickname      string     `json:"nickname"`
	Type          string     `json:"type"`
	Description   string     `json:"description"`
	UseDefault    bool       `json:"useDefaultConfiguration" gorm:"-"`
	Configuration []byte     `json:"configuration"`
	DeletedAt     *time.Time `json:"-"`
}
