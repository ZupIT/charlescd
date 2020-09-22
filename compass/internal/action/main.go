package action

import (
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	Validate(action Action) []util.ErrorUtil
	Parse(action io.ReadCloser) (Action, error)
	FindById(id string) (Action, error)
	FindAll() ([]Action, error)
	Save(action Action) (Action, error)
	Delete(id string) error
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
