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
	SubscriptionId uuid.UUID `json:"subscriptionId"`
	EventId        uuid.UUID `json:"eventId"`
}

func (main Main) Validate(subscription Request) errors.ErrorList {
	ers := errors.NewErrorList()

	if subscription.Url == "" {
		err := errors.NewError("Invalid data", "Url is required").
			WithMeta("field", "url").
			WithOperations("Validate.UrlIsNil")
		ers.Append(err)
	}

	if subscription.Description == "" {
		err := errors.NewError("Invalid data", "Description is required").
			WithMeta("field", "description").
			WithOperations("Validate.DescriptionIsNil")
		ers.Append(err)
	}

	if subscription.Events == nil || len(subscription.Events) == 0 {
		err := errors.NewError("Invalid data", "Events are required").
			WithMeta("field", "events").
			WithOperations("Validate.EventLen")
		ers.Append(err)
	}

	return ers
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

func (main Main) ParseUpdate(subscription io.ReadCloser) (UpdateRequest, errors.Error) {
	var newSubs *UpdateRequest
	err := json.NewDecoder(subscription).Decode(&newSubs)
	if err != nil {
		return UpdateRequest{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParseUpdate.ParseDecode")
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

func (main Main) Update(request UpdateRequest) (UpdateResponse, errors.Error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {

		deleteExec := tx.Where("subscription_id = ?", request.SubscriptionId).Delete(&SubscriptionConfigurationEvents{})
		if deleteExec.Error != nil {
			return deleteExec.Error
		}

		if len(request.Events) != 0 {
			_, err := main.saveSubscriptionEvents(request.Events, request.SubscriptionId, tx)
			if err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		return UpdateResponse{}, errors.NewError("Update Subscription error", err.Error()).
			WithOperations("Update.UpdateSubscription")
	}

	return UpdateResponse{Events: request.Events}, nil
}

func (main Main) Delete(subscriptionId uuid.UUID, author string) errors.Error {
	result := main.db.Model(&Subscription{}).Where("id = ?", subscriptionId).Updates(map[string]interface{}{"deleted_at": time.Now(), "deleted_by": author})
	if result.Error != nil {
		return errors.NewError("Delete Subscription error", result.Error.Error()).
			WithOperations("Delete.DeleteSubscription")
	}

	return nil
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
