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

package payloads

import (
	"encoding/json"
	"github.com/google/uuid"
	"time"
)

type Request struct {
	SubscriptionId uuid.UUID       `json:"subscriptionId"`
	EventType      string          `json:"eventType"`
	Event          json.RawMessage `json:"event"`
}

type PayloadRequest struct {
	ExternalId uuid.UUID       `json:"externalId"`
	EventType  string          `json:"eventType"`
	Event      json.RawMessage `json:"event"`
}

type MessageResponse struct {
	Id             uuid.UUID       `json:"id"`
	CreatedAt      time.Time       `json:"createdAt"`
	SubscriptionId uuid.UUID       `json:"subscriptionId"`
	LastStatus     string          `json:"lastStatus"`
	EventType      string          `json:"eventType"`
	Event          json.RawMessage `json:"event"`
	RetryCount int  `json:"retryCount"ss`
}

type FullMessageResponse struct {
	Id             uuid.UUID       `json:"id"`
	EventType      string          `json:"eventType"`
	Event          string          `json:"event"`
	LastStatus     string          `json:"lastStatus"`
	SubscriptionId uuid.UUID       `json:"subscriptionId"`
}

type StatusResponse struct {
	Status  int    `json:"status"`
	Details string `json:"details"`
}
