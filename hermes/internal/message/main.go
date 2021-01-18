package message

import (
	"gorm.io/gorm"
	"hermes/pkg/errors"
	"io"
)

type UseCases interface {
	ParseMessage(subscription io.ReadCloser) (Request, errors.Error)
	Save(message Request) (ExecutionResponse, errors.Error)
}

type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
