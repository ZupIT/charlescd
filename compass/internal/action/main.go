package action

import (
	"compass/internal/plugin"
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateAction(action Action) []util.ErrorUtil
	ParseAction(action io.ReadCloser) (Action, error)
	FindActionByIdAndWorkspace(id string, workspaceID string) (Action, error)
	FindActionById(id string) (Action, error)
	FindAllActionsByWorkspace(workspaceID string) ([]Action, error)
	SaveAction(action Action) (Action, error)
	DeleteAction(id string) error
}

type Main struct {
	db         *gorm.DB
	pluginRepo plugin.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases) UseCases {
	return Main{db, pluginRepo}
}
