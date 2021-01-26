package publisher

import (
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"io"
)

type UseCases interface {
	ParseMessage(message io.ReadCloser) (Request, errors.Error)
	Validate(message Request) errors.ErrorList
	Publish(message Request, subscriptionIds []uuid.UUID) (SaveResponse, errors.Error)
}
//type Main struct {
//	db         *gorm.DB
//}
//
//func NewMain(db *gorm.DB) UseCases {
//	return Main{db}
//}