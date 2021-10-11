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

package message

import (
	"encoding/json"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"hermes/internal/configuration"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"io"
	"strings"
	"time"
)

type Message struct {
	ID             uuid.UUID `json:"id"`
	CreatedAt      time.Time `json:"-"`
	SubscriptionID uuid.UUID `json:"subscriptionId"`
	LastStatus     string    `json:"lastStatus"`
	EventType      string    `json:"eventType"`
	Event          string    `json:"event" gorm:"type:jsonb"`
}

const (
	messageResponseSizeLimit = 50
)

func (main Main) Validate(message payloads.PayloadRequest) errors.ErrorList {
	ers := errors.NewErrorList()

	if message.ExternalID == uuid.Nil {
		err := errors.NewError("Invalid data", "ExternalID is required").
			WithMeta("field", "externalId").
			WithOperations("Validate.ExternalIdIsNil")
		ers.Append(err)
	}

	if message.EventType == "" {
		err := errors.NewError("Invalid data", "EventType is required").
			WithMeta("field", "eventType").
			WithOperations("Validate.EventTypeIsNil")
		ers.Append(err)
	}

	if message.Event == nil || len(message.Event) == 0 {
		err := errors.NewError("Invalid data", "Event is required").
			WithMeta("field", "event").
			WithOperations("Validate.EventLen")
		ers.Append(err)
	}

	return ers
}

func (main Main) ParsePayload(request io.ReadCloser) (payloads.PayloadRequest, errors.Error) {
	var payload *payloads.PayloadRequest
	err := json.NewDecoder(request).Decode(&payload)
	if err != nil {
		return payloads.PayloadRequest{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParsePayload.ParseDecode")
	}
	return *payload, nil
}

func (main Main) Publish(messagesRequest []payloads.Request) ([]payloads.FullMessageResponse, errors.Error) {
	var msgList []Message
	var msgsIds []string
	for _, r := range messagesRequest {
		msg := requestToEntity(r)
		msgList = append(msgList, msg)
		msgsIds = append(msgsIds, msg.ID.String())
	}

	result := main.db.Model(&Message{}).Create(&msgList)
	if result.Error != nil {
		return []payloads.FullMessageResponse{}, errors.NewError("Save Message error", result.Error.Error()).
			WithOperations("Publish.Result")
	}

	return main.findByMessagesIds(msgsIds)
}

func (main Main) findByMessagesIds(messagesIds []string) ([]payloads.FullMessageResponse, errors.Error) {
	var response []payloads.FullMessageResponse

	result := main.db.Model(&Message{}).
		Where("id IN ?", messagesIds).Limit(messageResponseSizeLimit).
		Scan(&response)
	if result.Error != nil {
		return []payloads.FullMessageResponse{}, errors.NewError("Save Message error", result.Error.Error()).
			WithOperations("Publish.Result")
	}
	return response, nil
}

func (main Main) FindAllNotEnqueued() ([]payloads.MessageResponse, errors.Error) {
	var response []payloads.MessageResponse

	query := main.db.Raw(FindAllNotEnqueuedQuery, configuration.GetConfiguration("PUBLISHER_ATTEMPTS")).Scan(&response)
	if query.Error != nil {
		return []payloads.MessageResponse{}, errors.NewError("FindAllNotEnqueued Message error", query.Error.Error()).
			WithOperations("FindAllNotEnqueued.Query")
	}

	return response, nil
}

func (main Main) FindAllBySubscriptionIDAndFilter(subscriptionID uuid.UUID, parameters map[string]string, page int, size int) ([]payloads.FullMessageResponse, errors.Error) {
	var cond interface{}

	eventValue := parameters["EventValue"]
	eventField := parameters["EventField"]

	if eventValue != "" && eventField != "" {
		keys := strings.Split(eventField, ".")
		cond = datatypes.JSONQuery("event").Equals(eventValue, keys...)
	}

	query, response := main.buildQuery(subscriptionID, cond, parameters, page, size)
	if query.Error != nil {
		return []payloads.FullMessageResponse{}, errors.NewError("FindAllBySubscriptionIDAndFilter Message error", query.Error.Error()).
			WithOperations("FindAllBySubscriptionIDAndFilter.Query")
	}

	return response, nil
}

func (main Main) buildQuery(subscriptionID uuid.UUID, cond interface{}, params map[string]string, page int, size int) (*gorm.DB, []payloads.FullMessageResponse) {
	var response []payloads.FullMessageResponse

	if params["EventType"] != "" && params["Status"] != "" {
		return main.db.Model(&Message{}).
			Where("subscription_id = ? AND event_type = ? AND last_status =?", subscriptionID, params["EventType"], params["Status"]).
			Offset(page*size).Limit(size).
			Find(&response, cond), response
	}

	if params["EventType"] != "" {
		return main.db.Model(&Message{}).
			Where("subscription_id = ? AND event_type = ?", subscriptionID, params["EventType"]).
			Offset(page*size).Limit(size).
			Find(&response, cond), response
	}

	if params["Status"] != "" {
		return main.db.Model(&Message{}).
			Where("subscription_id = ? AND last_status = ?", subscriptionID, params["Status"]).
			Offset(page*size).Limit(size).
			Find(&response, cond), response
	}

	return main.db.Model(&Message{}).Where("subscription_id = ?", subscriptionID).Offset(page*size).Limit(size).Find(&response, cond), response
}

func (main Main) FindMostRecent(subscriptionID uuid.UUID) (payloads.StatusResponse, errors.Error) {
	r := payloads.FullMessageResponse{}

	q := main.db.Model(&Message{}).Where("subscription_id = ?", subscriptionID).Order("created_at desc").Limit(1).Find(&r)
	if q.Error != nil {
		return payloads.StatusResponse{}, errors.NewError("FindAllNotEnqueued Message error", q.Error.Error()).
			WithOperations("FindAllNotEnqueued.Query")
	}

	if r.LastStatus == "DELIVERED" {
		return payloads.StatusResponse{Status: 200, Details: "Webhook available, last message was successfully sent"}, nil
	}

	if r.LastStatus == "DELIVERED_FAILED" {
		lastExecution, err := main.executionMain.FindLastByExecutionID(r.ID)
		if err != nil {
			return payloads.StatusResponse{Status: 500, Details: err.Error().Detail}, nil
		}

		if lastExecution.HTTPStatus != 0 {
			return payloads.StatusResponse{Status: lastExecution.HTTPStatus, Details: lastExecution.ExecutionLog}, nil
		}
	}

	if r.LastStatus == "NOT_ENQUEUED" || r.LastStatus == "ENQUEUED" {
		lastExecution, err := main.executionMain.FindLastByExecutionID(r.ID)

		if err != nil {
			return payloads.StatusResponse{Status: 500, Details: err.Error().Detail}, nil
		}

		if lastExecution.ExecutionLog != "" {
			return payloads.StatusResponse{Status: 500, Details: "Failed to publish message"}, nil
		}
	}

	return payloads.StatusResponse{Status: 418, Details: "Awaiting first delivery"}, nil
}

func requestToEntity(r payloads.Request) Message {
	return Message{
		ID:             uuid.New(),
		SubscriptionID: r.SubscriptionID,
		EventType:      r.EventType,
		Event:          string(r.Event),
	}
}
