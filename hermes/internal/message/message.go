package message

import (
	"encoding/json"
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
)

type Message struct {
	util.BaseModel
	SubscriptionId uuid.UUID `json:"subscriptionId"`
	EventType      string    `json:"eventType"`
	Event          string    `json:"event" gorm:"type:jsonb"`
}

func (main Main) ParseMessage(subscription io.ReadCloser) (Request, errors.Error) {
	var msg *Request
	err := json.NewDecoder(subscription).Decode(&msg)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *msg, nil
}

func (main Main) Save(message Request) (ExecutionResponse, errors.Error) {
	id := uuid.New()
	execution := Message{
		BaseModel: util.BaseModel{
			ID: id,
		},
		SubscriptionId: message.SubscriptionId,
		EventType:      message.EventType,
		Event:          string(message.Event),
	}

	result := main.db.Model(&Message{}).Create(&execution)
	if result.Error != nil {
		return ExecutionResponse{}, errors.NewError("Save Message error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return ExecutionResponse{execution.ID}, nil
}
