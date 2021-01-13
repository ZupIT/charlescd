package subscriptionexecution

import (
	"encoding/json"
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
)

type SubscriptionsEventsExecution struct {
	util.BaseModel
	SubscriptionId uuid.UUID `json:"subscriptionId"`
	ExecutionLog   string    `json:"executionLog"`
	EventType      string    `json:"eventType"`
	Event          string    `json:"event" gorm:"type:jsonb"`
	Status         string    `json:"status"`
}

func (main Main) ParseExecution(subscription io.ReadCloser) (Request, errors.Error) {
	var newSubs *Request
	err := json.NewDecoder(subscription).Decode(&newSubs)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *newSubs, nil
}

func (main Main) Save(subscriptionExecution Request) (ExecutionResponse, errors.Error) {
	id := uuid.New()
	execution := SubscriptionsEventsExecution{
		BaseModel: util.BaseModel{
			ID: id,
		},
		SubscriptionId: subscriptionExecution.SubscriptionId,
		ExecutionLog:   subscriptionExecution.ExecutionLog,
		EventType:      subscriptionExecution.EventType,
		Event:          string(subscriptionExecution.Event),
		Status:         subscriptionExecution.Status,
	}

	result := main.db.Model(&SubscriptionsEventsExecution{}).Create(&execution)
	if result.Error != nil {
		return ExecutionResponse{}, errors.NewError("Save Subscription Execution error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return ExecutionResponse{execution.ID}, nil
}
