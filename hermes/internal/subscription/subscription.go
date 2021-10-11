/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/sirupsen/logrus"
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
	ExternalID  uuid.UUID      `json:"externalId"`
	URL         string         `json:"url"`
	Description string         `json:"description"`
	APIKey      []byte         `json:"apiKey" gorm:"type:bytea"`
	Events      pq.StringArray `json:"events" gorm:"type:text[]"`
	CreatedBy   string         `json:"createdBy"`
	DeletedBy   string         `json:"-"`
	DeletedAt   *time.Time     `json:"-"`
}

func (main Main) Validate(subscription Request) errors.ErrorList {
	ers := errors.NewErrorList()

	if subscription.URL == "" {
		err := errors.NewError("Invalid data", "URL is required").
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

	insert := main.db.Model(Subscription{}).Create(InsertMap(id, request.ExternalID, request.URL, request.Description, request.APIKey, request.CreatedBy, request.Events)).Scan(&response)
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

func (main Main) Update(subscriptionID uuid.UUID, request UpdateRequest) (Response, errors.Error) {
	var response = Response{}

	update := main.db.Model(&Subscription{}).
		Where("id = ?", subscriptionID).
		Update("events", &request.Events).
		Scan(&response)

	if update.Error != nil {
		return Response{}, errors.NewError("Update Subscription error", update.Error.Error()).
			WithOperations("Update.UpdateSubscription")
	}

	return response, nil
}

func (main Main) Delete(subscriptionID uuid.UUID, author string) errors.Error {
	result := main.db.Model(&Subscription{}).Where("id = ?", subscriptionID).Updates(map[string]interface{}{"deleted_at": time.Now(), "deleted_by": author})
	if result.Error != nil {
		return errors.NewError("Delete Subscription error", result.Error.Error()).
			WithOperations("Delete.DeleteSubscription")
	}

	return nil
}

func (main Main) FindByID(subscriptionID uuid.UUID) (Response, errors.Error) {
	res := Response{}

	err := main.db.Set("gorm:auto_preload", true).Raw(decryptedSubscriptionQuery(), subscriptionID).Row().
		Scan(&res.ID, &res.Description, &res.ExternalID, &res.URL, &res.APIKey, &res.Events)
	if err != nil {
		return Response{}, errors.NewError("Find Subscription error", err.Error()).
			WithOperations("FindByID.QuerySubscription")
	}

	return res, nil
}

func (main Main) FindAllByExternalIDAndEvent(externalID uuid.UUID, event string) ([]ExternalIDResponse, errors.Error) {
	var res []ExternalIDResponse

	q := main.db.Model(&Subscription{}).Find(&res, "external_id = ? AND ? = any(events) AND deleted_at IS NULL", externalID.String(), event)
	if q.Error != nil {
		return []ExternalIDResponse{}, errors.NewError("Find Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("FindAllByExternalIDAndEvent.QuerySubscription")
	}

	return res, nil
}

func (main Main) FindAllByExternalID(externalID uuid.UUID) ([]Response, errors.Error) {
	var res []Response

	q := main.db.Model(&Subscription{}).Find(&res, "external_id = ? AND deleted_at IS NULL", externalID)
	if q.Error != nil {
		return []Response{}, errors.NewError("Find Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("FindAllByExternalID.QuerySubscription")
	}

	return res, nil
}

func (main Main) CountAllByExternalID(externalID uuid.UUID) (int64, errors.Error) {
	var count int64

	q := main.db.Model(&Subscription{}).Where("external_id = ? AND deleted_at IS NULL", externalID).Count(&count)
	if q.Error != nil {
		return 0, errors.NewError("Count Subscription Using ExternalID error", q.Error.Error()).
			WithOperations("CountAllByExternalID.QuerySubscription")
	}

	return count, nil
}

func (main Main) SendWebhookEvent(msg payloads.MessageResponse) errors.Error {
	sub, e := main.FindByID(msg.SubscriptionID)
	if e != nil {
		return e
	}

	msgEvent, err := msg.Event.MarshalJSON()
	if err != nil {
		return errors.NewError("Error marshaling message event: ", err.Error()).
			WithOperations(msg.ID.String())
	}

	type eventBody struct {
		Content string `json:"content"`
	}
	reqBody, err := json.Marshal(eventBody{Content: string(msgEvent)})

	if err != nil {
		return errors.NewError("Error marshalling event: ", err.Error())
	}

	req, err := http.NewRequest("POST", sub.URL, bytes.NewBuffer(reqBody))
	if err != nil {
		return errors.NewError("Error creating http request: ", err.Error()).
			WithOperations(sub.URL)
	}

	req.Header.Add("Content-type", "application/json")
	if string(sub.APIKey) != "" {
		req.Header.Add("x-application-key", string(sub.APIKey))
	}

	res, err := http.DefaultClient.Do(req)

	if res == nil {
		return httpErrorHandler(404, sub.URL, "Invalid url")
	}

	if err != nil {
		return httpErrorHandler(res.StatusCode, sub.URL, err.Error())
	}

	if res.StatusCode < 200 || res.StatusCode > 226 {
		return httpErrorHandler(res.StatusCode, sub.URL, res.Status)
	}

	defer res.Body.Close()
	resBody, err := ioutil.ReadAll(res.Body)

	if err != nil {
		httpErrorHandler(http.StatusInternalServerError, sub.URL, err.Error())
	}
	logrus.Infof("[Webhook] Status: %d - Body: %s\n", res.StatusCode, resBody)

	return nil
}

func httpErrorHandler(httpStatus int, url, error string) *errors.AdvancedError {
	return errors.NewError("Error calling http request: ", error).
		WithOperations(url).
		WithMeta("http-status", strconv.Itoa(httpStatus))
}
