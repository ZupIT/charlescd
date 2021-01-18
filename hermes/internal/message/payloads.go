package message

import (
	"encoding/json"
	"github.com/google/uuid"
)

type Request struct {
	SubscriptionId uuid.UUID       `json:"subscriptionId"`
	ExecutionLog   string          `json:"executionLog"`
	EventType      string          `json:"eventType"`
	Event          json.RawMessage `json:"event"`
	Status         string          `json:"status"`
}

type ExecutionResponse struct {
	Id uuid.UUID `json:"id"`
}
