package subscription

import (
	"gorm.io/gorm"
	"hermes/pkg/errors"
	"io"
)

type UseCases interface {
	ParseSubscription(subscription io.ReadCloser) (Request, errors.Error)
	Save(subscription Request) (Response, errors.Error)
}
type Main struct {
	db         *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}