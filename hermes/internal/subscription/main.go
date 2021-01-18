package subscription

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"hermes/pkg/errors"
	"io"
)

type UseCases interface {
	ParseSubscription(subscription io.ReadCloser) (Request, errors.Error)
	ParseUpdate(subscription io.ReadCloser) ([]byte, errors.Error)
	Validate(subscription Request) errors.ErrorList
	Save(subscription Request) (SaveResponse, errors.Error)
	Update(subscriptionId uuid.UUID, subscription []byte) (UpdateResponse, errors.Error)
	Delete(subscriptionId uuid.UUID, author string) errors.Error
	FindById(subscriptionId uuid.UUID) (Response, errors.Error)
	FindAllByExternalIdAndEvent(externalId uuid.UUID, event string) ([]ExternalIdResponse, errors.Error)
}
type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
