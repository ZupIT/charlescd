package messageexecutionhistory

import (
	"gorm.io/gorm"
	"hermes/pkg/errors"
)

type UseCases interface {
	Save(execution Request) (Response, errors.Error)
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}