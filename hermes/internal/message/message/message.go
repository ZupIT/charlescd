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
	"hermes/internal/message/payloads"
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

func (main Main) ParsePayload(request io.ReadCloser) (payloads.PayloadRequest, errors.Error) {
	var payload *payloads.PayloadRequest
	err := json.NewDecoder(request).Decode(&payload)
	if err != nil {
		return payloads.PayloadRequest{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParsePayload.ParseDecode")
	}
	return *payload, nil
}

func (main Main) ParseMessage(request io.ReadCloser) (payloads.Request, errors.Error) {
	var msg *payloads.Request
	err := json.NewDecoder(request).Decode(&msg)
	if err != nil {
		return payloads.Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParseMessage.ParseDecode")
	}
	return *msg, nil
}

func (main Main) Publish(messagesRequest []payloads.Request) ([]payloads.MessageResponse, errors.Error) {
	var resList []payloads.MessageResponse

	for _, r := range messagesRequest {
		var response payloads.MessageResponse

		msg := Message{
			BaseModel:      util.BaseModel{ID: uuid.New()},
			SubscriptionId: r.SubscriptionId,
			EventType:      r.EventType,
			Event:          string(r.Event),
		}

		result := main.db.Model(&Message{}).Create(&msg).Scan(&response)
		if result.Error != nil {
			return []payloads.MessageResponse{}, errors.NewError("Save Message error", result.Error.Error()).
				WithOperations("Save.Result")
		}

		pushMsg, err := json.Marshal(response)
		if err != nil {
			return []payloads.MessageResponse{}, errors.NewError("Save Message error", err.Error()).
				WithOperations("Save.Marshal")
		}

		err = main.amqpClient.Push(pushMsg)
		if err != nil {
			return []payloads.MessageResponse{}, errors.NewError("Save Message error", err.Error()).
				WithOperations("Save.Push")
		}

		convertedMsg := requestToResponse(response)
		_, execErr := main.executionMain.Save(convertedMsg)
		if execErr != nil {
			return []payloads.MessageResponse{}, errors.NewError("Save Message error", err.Error()).
				WithOperations("Save.Execution")
		}

		resList = append(resList, response)
	}

	return resList, nil
}

func requestToResponse (response payloads.MessageResponse) payloads.ExecutionRequest {
	return payloads.ExecutionRequest{
		ExecutionId: response.Id,
		EventType:   response.EventType,
		Event:       response.Event,
	}
}
