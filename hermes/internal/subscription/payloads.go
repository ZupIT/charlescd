package subscription

import (
	"encoding/json"
	"github.com/google/uuid"
	"hermes/util"
)

type Request struct {
	util.BaseModel
	ExternalId  uuid.UUID       `json:"externalId"`
	Url         string          `json:"url"`
	Description string          `json:"description"`
	ApiKey      string          `json:"apiKey"`
	Events      json.RawMessage `json:"events"`
	CreatedBy   string          `json:"createdBy"`
}

type UpdateRequest struct {
	Events json.RawMessage `json:"events"`
}

type SaveResponse struct {
	util.BaseModel
}

type UpdateResponse struct {
	Events json.RawMessage `json:"events"`
}

type Response struct {
	ExternalId  uuid.UUID       `json:"externalId"`
	Url         string          `json:"url"`
	Description string          `json:"description"`
	Events      json.RawMessage `json:"events"`
}

type ExternalIdResponse struct {
	Id          uuid.UUID       `json:"id"`
	ExternalId  uuid.UUID       `json:"externalId"`
	Url         string          `json:"url"`
	Description string          `json:"description"`
	ApiKey      string          `json:"apiKey"`
	Events      json.RawMessage `json:"events"`
}
