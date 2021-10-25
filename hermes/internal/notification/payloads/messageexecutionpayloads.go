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

package payloads

import (
	"github.com/google/uuid"
	"time"
)

type FullMessageExecutionResponse struct {
	ID           uuid.UUID `json:"-"`
	ExecutionID  uuid.UUID `json:"-"`
	ExecutionLog string    `json:"executionLog"`
	HTTPStatus   int       `json:"httpStatus"`
	Status       string    `json:"status"`
	LoggedAt     time.Time `json:"loggedAt"`
}

type HistoryResponse struct {
	FullMessageResponse
	Executions []FullMessageExecutionResponse `json:"executions"`
}
