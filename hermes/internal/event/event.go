package event

import (
	"github.com/google/uuid"
	"hermes/pkg/errors"
)

type SubscriptionEvent struct {
	Id uuid.UUID `json:"id"`
	Event string `json:"event"`
}

func (main Main) FindAll() ([]Response, errors.Error) {
	var result []Response

	query := main.db.Model(&SubscriptionEvent{}).Find(&result)
	if query.Error != nil {
		return []Response{}, errors.NewError("Find Events error", query.Error.Error()).
			WithOperations("FindAll.Query")
	}

	return result, nil
}
