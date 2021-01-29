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
	LastStatus     string    `json:"lastStatus"`
	Event          string    `json:"event" gorm:"type:jsonb"`
}

func (main Main) ParseMessage(subscription io.ReadCloser) (Request, errors.Error) {
	var msg *Request
	err := json.NewDecoder(subscription).Decode(&msg)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *msg, nil
}

func (main Main) Save(message Request) (ExecutionResponse, errors.Error) {
	id := uuid.New()
	execution := Message{
		BaseModel: util.BaseModel{
			ID: id,
		},
		SubscriptionId: message.SubscriptionId,
		EventType:      message.EventType,
		Event:          string(message.Event),
	}

	result := main.db.Model(&Message{}).Create(&execution)
	if result.Error != nil {
		return ExecutionResponse{}, errors.NewError("Save Message error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return ExecutionResponse{execution.ID}, nil
}
