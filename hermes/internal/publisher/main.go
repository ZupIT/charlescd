package publisher

import (
	"gorm.io/gorm"
	"hermes/pkg/errors"
	"io"
)

type UseCases interface {
	ParseMessage(message io.ReadCloser) (Request, errors.Error)
	Validate(message Request) errors.ErrorList
	Publish(message Request) (SaveResponse, errors.Error)
}
type Main struct {
	db         *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}