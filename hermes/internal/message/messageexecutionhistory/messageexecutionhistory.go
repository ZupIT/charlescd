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
	"hermes/internal/message/payloads"
	"hermes/pkg/errors"
	"time"
)

type MessagesExecutionsHistory struct {
	ID           uuid.UUID `json:"id"`
	ExecutionId  uuid.UUID `json:"executionId"`
	ExecutionLog string    `json:"executionLog"`
	Status       string    `json:"status"`
	LoggedAt     time.Time `json:"-"`
}

func (main Main) Save(executionsRequest payloads.ExecutionRequest) (payloads.Response, errors.Error) {

	exec := MessagesExecutionsHistory{
		ID:           uuid.New(),
		ExecutionId:  executionsRequest.ExecutionId,
		ExecutionLog: "LOGGER",  //TODO
		Status:       "SUCCESS", //TODO
		LoggedAt:     time.Now(),
	}

	result := main.db.Model(&MessagesExecutionsHistory{}).Create(&exec)
	if result.Error != nil {
		return payloads.Response{}, errors.NewError("Save Message Execution error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return payloads.Response{Id: exec.ID}, nil
}
