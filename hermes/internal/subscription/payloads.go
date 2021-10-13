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
	"github.com/google/uuid"
	"github.com/lib/pq"
	"hermes/util"
)

type Request struct {
	util.BaseModel
	ExternalID  uuid.UUID      `json:"externalId"`
	URL         string         `json:"url"`
	Description string         `json:"description"`
	APIKey      string         `json:"apiKey"`
	Events      pq.StringArray `json:"events"`
	CreatedBy   string         `json:"createdBy"`
}

type UpdateRequest struct {
	Events pq.StringArray `json:"events"`
}

type SaveResponse struct {
	util.BaseModel
}

type Response struct {
	ID          uuid.UUID      `json:"id"`
	ExternalID  uuid.UUID      `json:"externalId"`
	APIKey      []byte         `json:"apiKey" gorm:"type:bytea"`
	URL         string         `json:"url"`
	Description string         `json:"description"`
	Events      pq.StringArray `json:"events" gorm:"type:text[]"`
}

type ExternalIDResponse struct {
	ID uuid.UUID `json:"id"`
}
