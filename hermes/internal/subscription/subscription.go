package subscription

import (
	"encoding/json"
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
	"io/ioutil"
	"time"
)

type Subscription struct {
	util.BaseModel
	ExternalId  uuid.UUID       `json:"externalId"`
	Url         string          `json:"url"`
	Description string          `json:"description"`
	ApiKey      []byte          `json:"apiKey" gorm:"type:bytea"`
	Events      json.RawMessage `json:"events" gorm:"type:jsonb"`
	CreatedBy   string          `json:"createdBy"`
	DeletedBy   string          `json:"-"`
	DeletedAt   *time.Time      `json:"-"`
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

func (main Main) ParseUpdate(subscription io.ReadCloser) ([]byte, errors.Error) {
	body, err := ioutil.ReadAll(subscription)
	if err != nil {
		return []byte(""), errors.NewError("Parse error", err.Error()).
			WithOperations("ParseUpdate.ParseDecode")
	}
	return body, nil
}

func (main Main) Save(request Request) (SaveResponse, errors.Error) {
	id := uuid.New()
	var response = SaveResponse{}

	insert := main.db.Model(Subscription{}).Create(InsertMap(id, request.ExternalId, request.Url, request.Description, request.ApiKey, request.CreatedBy, request.Events)).Scan(&response)
	if insert.Error != nil {
		return SaveResponse{}, errors.NewError("Save Subscription error", insert.Error.Error()).
			WithOperations("Save.Insert")
	}

	query := insert.Model(&Subscription{}).Where("id = ?", id).Find(&response)
	if query.Error != nil {
		return SaveResponse{}, errors.NewError("Save Subscription error", insert.Error.Error()).
			WithOperations("Save.Query")
	}

	return response, nil
}

func (main Main) Update(subscriptionId uuid.UUID, request []byte) (UpdateResponse, errors.Error) {
	update := main.db.Model(&Subscription{}).Where("id = ?", subscriptionId).Update("events", &request)
	if update.Error != nil {
		return UpdateResponse{}, errors.NewError("Update Subscription error", update.Error.Error()).
			WithOperations("Update.UpdateSubscription")
	}

	return UpdateResponse{Events: request}, nil
}

func (main Main) Delete(subscriptionId uuid.UUID, author string) errors.Error {
	result := main.db.Model(&Subscription{}).Where("id = ?", subscriptionId).Updates(map[string]interface{}{"deleted_at": time.Now(), "deleted_by": author})
	if result.Error != nil {
		return errors.NewError("Delete Subscription error", result.Error.Error()).
			WithOperations("Delete.DeleteSubscription")
	}

	return nil
}

func (main Main) FindById(subscriptionId uuid.UUID) (Response, errors.Error) {
	result := Response{}

	subsQuery := main.db.Raw(FindOneQuery(subscriptionId.String())).Row()
	subsErr := subsQuery.Scan(&result.ExternalId, &result.Url, &result.Description, &result.Events)
	if subsErr != nil {
		return Response{}, errors.NewError("Find Subscription error", subsErr.Error()).
			WithOperations("FindById.QuerySubscription")
	}

	return result, nil
}

func (main Main) FindAllByExternalId(externalId uuid.UUID) ([]Response, errors.Error) {
	var res []Response
	q := main.db.Model(&Subscription{}).Find(&res, "external_id = ?", externalId.String())
	if q.Error != nil {
		return []Response{}, errors.NewError("Find Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("FindAllByExternalId.QuerySubscription")
	}
	return res, nil
}
