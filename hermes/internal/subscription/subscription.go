package subscription

import (
	"encoding/json"
	"github.com/google/uuid"
	"gorm.io/gorm"
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

type SubscriptionConfigurationEvents struct {
	SubscriptionId uuid.UUID `json:"externalId"`
	EventId        uuid.UUID `json:"eventId"`
}

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

func (main Main) Save(request Request) (SaveResponse, errors.Error) {
	id := uuid.New()
	var response = SaveResponse{}

	err := main.db.Transaction(func(tx *gorm.DB) error {
		insert := tx.Model(Subscription{}).Create(InsertMap(id, request.ExternalId, request.Url, request.Description, request.ApiKey, request.CreatedBy))
		if insert.Error != nil {
			return insert.Error
		}

		_, err := main.saveSubscriptionEvents(request.Events, id, tx)
		if err != nil {
			return err
		}

		query := insert.Model(&Subscription{}).Where("id = ?", id).Find(&response)
		if query.Error != nil {
			return query.Error
		}

		return nil
	})
	if err != nil {
		return SaveResponse{}, errors.NewError("Save Subscription error", err.Error()).
			WithOperations("Save.Transaction")
	}

	return response, nil
}

func (main Main) saveSubscriptionEvents(events []uuid.UUID, subscriptionId uuid.UUID, tx *gorm.DB) ([]SubscriptionConfigurationEvents, error) {
	configEvents := make([]SubscriptionConfigurationEvents, 0)

	for _, event := range events {
		configEvents = append(configEvents, SubscriptionConfigurationEvents{
			SubscriptionId: subscriptionId,
			EventId:        event,
		})
	}

	save := tx.Create(&configEvents)
	if save.Error != nil {
		return []SubscriptionConfigurationEvents{}, save.Error
	}

	return configEvents, nil
}
