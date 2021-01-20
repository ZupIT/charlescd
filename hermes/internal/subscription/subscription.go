/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
	res := Response{}

	q := main.db.Model(&Subscription{}).First(&res, "id = ? AND deleted_at IS NULL", subscriptionId.String())
	if q.Error != nil {
		return Response{}, errors.NewError("Find Subscription error", q.Error.Error()).
			WithOperations("FindById.QuerySubscription")
	}

	return res, nil
}

func (main Main) FindAllByExternalIdAndEvent(externalId uuid.UUID, event string) ([]ExternalIdResponse, errors.Error) {
	var res []ExternalIdResponse

	q := main.db.Model(&Subscription{}).Find(&res, "external_id = ? AND events = ? AND deleted_at IS NULL", externalId.String(), map[string]interface{}{"event": event})
	if q.Error != nil {
		return []ExternalIdResponse{}, errors.NewError("Find Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("FindAllByExternalIdAndEvent.QuerySubscription")
	}

	return res, nil
}
