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

package message

import (
	"encoding/json"
	"github.com/google/uuid"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
)

type Message struct {
	util.BaseModel
	SubscriptionId uuid.UUID `json:"subscriptionId"`
	EventType      string    `json:"eventType"`
	Event          string    `json:"event" gorm:"type:jsonb"`
}

func (main Main) ParsePayload(request io.ReadCloser) (PayloadRequest, errors.Error) {
	var payload *PayloadRequest
	err := json.NewDecoder(request).Decode(&payload)
	if err != nil {
		return PayloadRequest{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParsePayload.ParseDecode")
	}
	return *payload, nil
}

func (main Main) ParseMessage(request io.ReadCloser) (Request, errors.Error) {
	var msg *Request
	err := json.NewDecoder(request).Decode(&msg)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParseMessage.ParseDecode")
	}
	return *msg, nil
}

func (main Main) Save(messagesRequest []Request) ([]ExecutionResponse, errors.Error) {
	var response []ExecutionResponse
	var messages []Message

	for _, r := range messagesRequest {
		msg := Message{
			BaseModel:      util.BaseModel{ID: uuid.New()},
			SubscriptionId: r.SubscriptionId,
			EventType:      r.EventType,
			Event:          string(r.Event),
		}
		messages = append(messages, msg)
	}

	result := main.db.Model(&Message{}).Create(&messages).Scan(&response)
	if result.Error != nil {
		return []ExecutionResponse{}, errors.NewError("Save Message error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return response, nil
}
