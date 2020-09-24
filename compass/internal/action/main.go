package action

import (
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateAction(action Action) []util.ErrorUtil
	ParseAction(action io.ReadCloser) (Action, error)
	FindActionById(id string) (Action, error)
	FindAllActions() ([]Action, error)
	SaveAction(action Action) (Action, error)
	UpdateAction(id string, action Action) (Action, error)
	DeleteAction(id string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
