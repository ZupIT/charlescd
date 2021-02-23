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

package messageexecutionhistory

import (
	"github.com/google/uuid"
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"time"
)

type MessagesExecutionsHistory struct {
	ID           uuid.UUID `json:"id"`
	ExecutionId  uuid.UUID `json:"executionId"`
	ExecutionLog string    `json:"executionLog"`
	Status       string    `json:"status"`
	HttpStatus   int       `json:"httpStatus"`
	LoggedAt     time.Time `json:"-"`
}

func (main Main) FindAllByExecutionId(executionId []uuid.UUID) ([]payloads.FullMessageExecutionResponse, errors.Error) {
	var response []payloads.FullMessageExecutionResponse

	query := main.db.Model(&MessagesExecutionsHistory{}).Where("execution_id IN ?", executionId).Order("logged_at desc").Find(&response)
	if query.Error != nil {
		return []payloads.FullMessageExecutionResponse{}, errors.NewError("FindAllByExecutionId History error", query.Error.Error()).
			WithOperations("FindAllByExecutionId.Result")
	}

	return response, nil
}

func (main Main) FindLastByExecutionId(executionId uuid.UUID) (payloads.FullMessageExecutionResponse, errors.Error) {
	var response payloads.FullMessageExecutionResponse

	query := main.db.Model(&MessagesExecutionsHistory{}).Where("execution_id = ?", executionId).Order("logged_at desc").Find(&response).Limit(1)
	if query.Error != nil {
		return payloads.FullMessageExecutionResponse{}, errors.NewError("FindLastByExecutionId History error", query.Error.Error()).
			WithOperations("FindLastByExecution.Result")
	}

	return response, nil
}
