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
	ExternalId uuid.UUID  `json:"externalId"`
	Url        string     `json:"url"`
	ApiKey     []byte     `json:"apiKey" gorm:"type:bytea"`
	CreatedBy  string     `json:"createdBy"`
	DeletedBy  string     `json:"-"`
	DeletedAt  *time.Time `json:"-"`
}

type Request struct {
	util.BaseModel
	ExternalId uuid.UUID  `json:"externalId"`
	Url        string     `json:"url"`
	ApiKey     string     `json:"apiKey"`
	CreatedBy  string     `json:"createdBy"`
	DeletedBy  string     `json:"-"`
	DeletedAt  *time.Time `json:"-"`
}

type Response struct {
	util.BaseModel
	ExternalId uuid.UUID  `json:"externalId"`
	Url        string     `json:"url"`
	ApiKey     string     `json:"apiKey"`
	CreatedBy  string     `json:"createdBy"`
	DeletedBy  string     `json:"-"`
	DeletedAt  *time.Time `json:"-"`
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

func (main Main) Save(subscription Request) (Response, errors.Error) {
	id := uuid.New().String()
	entity := Subscription{}

	row := main.db.Exec(Insert(id, subscription.ExternalId.String(), subscription.Url, subscription.CreatedBy, []byte(subscription.ApiKey))).
		Raw(saveSubscriptionQuery, id).
		Row()

	err := row.Scan(&entity.ID, &entity.ExternalId, &entity.Url, &entity.CreatedBy, &entity.CreatedAt)
	if err != nil {
		return Response{}, errors.NewError("Save Subscription error", err.Error()).
			WithOperations("Save.RowScan")
	}

	return entity.toResponse(), nil
}

func (entity Subscription) toResponse() Response {
	return Response{
		BaseModel:  entity.BaseModel,
		ExternalId: entity.ExternalId,
		Url:        entity.Url,
		ApiKey:     string(entity.ApiKey),
		CreatedBy:  entity.CreatedBy,
		DeletedBy:  entity.DeletedBy,
		DeletedAt:  entity.DeletedAt,
	}
}
