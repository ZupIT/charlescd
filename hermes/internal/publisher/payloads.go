package publisher

import (
	"encoding/json"
	"github.com/google/uuid"
)

type Request struct {
	ExternalId uuid.UUID       `json:"externalId"`
	Type       string          `json:"type"`
	Details    json.RawMessage `json:"details"`
}

type MessageRequest struct {
	Request
	SubscriptionId uuid.UUID       `json:"subscriptionId"`
}


type SaveResponse struct {
}
