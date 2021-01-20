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
	"hermes/util"
)

type Request struct {
	util.BaseModel
	ExternalId  uuid.UUID       `json:"externalId"`
	Url         string          `json:"url"`
	Description string          `json:"description"`
	ApiKey      string          `json:"apiKey"`
	Events      json.RawMessage `json:"events"`
	CreatedBy   string          `json:"createdBy"`
}

type UpdateRequest struct {
	Events json.RawMessage `json:"events"`
}

type SaveResponse struct {
	util.BaseModel
}

type UpdateResponse struct {
	Events json.RawMessage `json:"events"`
}

type Response struct {
	ExternalId  uuid.UUID       `json:"externalId"`
	Url         string          `json:"url"`
	Description string          `json:"description"`
	Events      json.RawMessage `json:"events"`
}

type ExternalIdResponse struct {
	Id uuid.UUID `json:"id"`
}