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
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type Subscription struct {
	util.BaseModel
	ExternalId  uuid.UUID      `json:"externalId"`
	Url         string         `json:"url"`
	Description string         `json:"description"`
	ApiKey      []byte         `json:"apiKey" gorm:"type:bytea"`
	Events      pq.StringArray `json:"events" gorm:"type:text[]"`
	CreatedBy   string         `json:"createdBy"`
	DeletedBy   string         `json:"-"`
	DeletedAt   *time.Time     `json:"-"`
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

	var updateSubs *UpdateRequest

	err := json.NewDecoder(subscription).Decode(&updateSubs)
	if err != nil {
		return UpdateRequest{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParseUpdate.ParseDecode")
	}

	return *updateSubs, nil
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

func (main Main) Update(subscriptionId uuid.UUID, request UpdateRequest) (Response, errors.Error) {
	var response = Response{}

	update := main.db.Model(&Subscription{}).
		Where("id = ?", subscriptionId).
		Update("events", &request.Events).
		Scan(&response)

	if update.Error != nil {
		return Response{}, errors.NewError("Update Subscription error", update.Error.Error()).
			WithOperations("Update.UpdateSubscription")
	}

	return response, nil
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

	err := main.db.Set("gorm:auto_preload", true).Raw(decryptedSubscriptionQuery(), subscriptionId).Row().
		Scan(&res.ID, &res.Description, &res.ExternalId, &res.Url, &res.ApiKey, &res.Events)
	if err != nil {
		return Response{}, errors.NewError("Find Subscription error", err.Error()).
			WithOperations("FindById.QuerySubscription")
	}

	return res, nil
}

func (main Main) FindAllByExternalIdAndEvent(externalId uuid.UUID, event string) ([]ExternalIdResponse, errors.Error) {
	var res []ExternalIdResponse

	q := main.db.Model(&Subscription{}).Find(&res, "external_id = ? AND ? = any(events) AND deleted_at IS NULL", externalId.String(), event)
	if q.Error != nil {
		return []ExternalIdResponse{}, errors.NewError("Find Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("FindAllByExternalIdAndEvent.QuerySubscription")
	}

	return res, nil
}

func (main Main) FindAllByExternalId(externalId uuid.UUID) ([]Response, errors.Error) {
	var res []Response

	q := main.db.Model(&Subscription{}).Find(&res, "external_id = ? AND deleted_at IS NULL", externalId)
	if q.Error != nil {
		return []Response{}, errors.NewError("Find Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("FindAllByExternalId.QuerySubscription")
	}

	return res, nil
}

func (main Main) CountAllByExternalId(externalId uuid.UUID) (int64, errors.Error) {
	var count int64

	q := main.db.Model(&Subscription{}).Where("external_id = ? AND deleted_at IS NULL", externalId).Count(&count)
	if q.Error != nil {
		return 0, errors.NewError("Count Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("CountAllByExternalId.QuerySubscription")
	}

	return count, nil
}

func (main Main) SendWebhookEvent(msg payloads.MessageResponse) errors.Error {
	sub, e := main.FindById(msg.SubscriptionId)
	if e != nil {
		return e
	}

	msgEvent, err := msg.Event.MarshalJSON()
	if err != nil {
		return errors.NewError("Error marshaling message event: ", err.Error()).
			WithOperations(msg.Id.String())
	}

	type eventBody struct {
		Content string `json:"content"`
	}
	reqBody, err := json.Marshal(eventBody{Content: string(msgEvent)})

	req, err := http.NewRequest("POST", sub.Url, bytes.NewBuffer(reqBody))
	if err != nil {
		return errors.NewError("Error creating http request: ", err.Error()).
			WithOperations(sub.Url)
	}

	req.Header.Add("Content-type", "application/json")
	if string(sub.ApiKey) != "" {
		req.Header.Add("x-application-key", string(sub.ApiKey))
	}

	res, err := http.DefaultClient.Do(req)

	if res == nil {
		return httpErrorHandler(404, sub.Url, "Invalid url")
	}

	if err != nil {
		return httpErrorHandler(res.StatusCode, sub.Url, err.Error())
	}

	if res.StatusCode < 200 || res.StatusCode > 226 {
		return httpErrorHandler(res.StatusCode, sub.Url, res.Status)
	}

	defer res.Body.Close()
	resBody, err := ioutil.ReadAll(res.Body)
	fmt.Printf("[Webhook] Status: %d - Body: %s\n", res.StatusCode, resBody)

	return nil
}

func httpErrorHandler(httpStatus int, url, error string) *errors.AdvancedError {
	return errors.NewError("Error calling http request: ", error).
		WithOperations(url).
		WithMeta("http-status",  strconv.Itoa(httpStatus))
}
