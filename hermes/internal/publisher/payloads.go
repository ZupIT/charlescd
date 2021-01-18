package publisher

import (
	"encoding/json"
	"github.com/google/uuid"
)

type Request struct {
	ExternalId uuid.UUID       `json:"externalId"`
	EventType  string          `json:"eventType"`
	Event      json.RawMessage `json:"event"`
}

type MessageRequest struct {
	Request
	SubscriptionId uuid.UUID `json:"subscriptionId"`
}

type SaveResponse struct {
}
