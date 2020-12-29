package subscription

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"hermes/pkg/errors"
	"io"
)

type UseCases interface {
	ParseSubscription(subscription io.ReadCloser) (Request, errors.Error)
	ParseUpdate(subscription io.ReadCloser) (UpdateRequest, errors.Error)
	Validate(subscription Request) errors.ErrorList
	Save(subscription Request) (SaveResponse, errors.Error)
	Update(subscription UpdateRequest) (UpdateResponse, errors.Error)
	Delete(subscriptionId uuid.UUID, author string) errors.Error
}
type Main struct {
	db         *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}