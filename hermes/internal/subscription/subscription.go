package subscription

import (
	"encoding/json"
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
	"time"
)

type Subscription struct {
	util.BaseModel
	ExternalId  uuid.UUID  `json:"externalId"`
	Url         string     `json:"url"`
	Description string     `json:"description"`
	ApiKey      []byte     `json:"apiKey" gorm:"type:bytea"`
	CreatedBy   string     `json:"createdBy"`
	DeletedBy   string     `json:"-"`
	DeletedAt   *time.Time `json:"-"`
}

type Request struct {
	util.BaseModel
	ExternalId  uuid.UUID  `json:"externalId"`
	Url         string     `json:"url"`
	Description string     `json:"description"`
	ApiKey      string     `json:"apiKey"`
	CreatedBy   string     `json:"createdBy"`
	DeletedBy   string     `json:"-"`
	DeletedAt   *time.Time `json:"-"`
}

type SaveResponse struct {
	util.BaseModel
}

func (main Main) ParseSubscription(subscription io.ReadCloser) (Request, errors.Error) {
	var newSubs *Request
	err := json.NewDecoder(subscription).Decode(&newSubs)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *newSubs, nil
}

func (main Main) Save(subscription Request) (SaveResponse, errors.Error) {
	id := uuid.New()
	response := SaveResponse{}

	insert := main.db.Exec(Insert(id.String(), subscription.Description, subscription.ExternalId.String(), subscription.Url, subscription.CreatedBy, []byte(subscription.ApiKey)))
	if insert.Error != nil {
		return SaveResponse{}, errors.NewError("Save Subscription error", insert.Error.Error()).
			WithOperations("Save.Insert")
	}

	query := insert.Model(&Subscription{}).Where("id = ?", id).Find(&response)
	if query.Error != nil {
		return SaveResponse{}, errors.NewError("Save Subscription error", query.Error.Error()).
			WithOperations("Save.Query")
	}

	return response, nil
}
