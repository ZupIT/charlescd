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
	"hermes/pkg/errors"
	"time"
)

type MessagesExecutionHistory struct {
	ID           uuid.UUID `json:"id"`
	ExecutionId  uuid.UUID `json:"executionId"`
	ExecutionLog string    `json:"executionLog"`
	Status       string    `json:"status"`
	LoggedAt     time.Time `json:"-"`
}

func (main Main) Save(execution Request) (Response, errors.Error) {
	id := uuid.New()
	message := MessagesExecutionHistory{
		ID:           id,
		ExecutionId:  execution.ExecutionId,
		ExecutionLog: execution.ExecutionLog,
		Status:       execution.Status,
		LoggedAt:     time.Now(),
	}

	result := main.db.Model(&MessagesExecutionHistory{}).Create(&message)
	if result.Error != nil {
		return Response{}, errors.NewError("Save Subscription Execution error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return Response{message.ID}, nil
}