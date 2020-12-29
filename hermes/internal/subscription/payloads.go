package subscription

import (
	"github.com/google/uuid"
	"hermes/util"
	"time"
)

type Request struct {
	util.BaseModel
	ExternalId  uuid.UUID   `json:"externalId"`
	Url         string      `json:"url"`
	Description string      `json:"description"`
	ApiKey      string      `json:"apiKey"`
	Events      []uuid.UUID `json:"events"`
	CreatedBy   string      `json:"createdBy"`
	DeletedBy   string      `json:"-"`
	DeletedAt   *time.Time  `json:"-"`
}

type UpdateRequest struct {
	SubscriptionId uuid.UUID   `json:"subscriptionId"`
	Events         []uuid.UUID `json:"events"`
}

type SaveResponse struct {
	util.BaseModel
}

type UpdateResponse struct {
	Events         []uuid.UUID `json:"events"`
}
