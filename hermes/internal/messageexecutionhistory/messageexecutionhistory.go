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
	"hermes/util"
	"time"
)

type MessagesExecutionHistory struct {
	ID           uuid.UUID `json:"id"`
	ExecutionId  uuid.UUID `json:"executionId"`
	ExecutionLog string    `json:"executionLog"`
	Status       string    `json:"status"`
	LoggedAt     time.Time `json:"-"`
}

func (main Main) Save(executionsRequest []Request) (Response, errors.Error) {
	var executions []MessagesExecutionHistory

	conn := NewConnection("my-producer", "my-exchange", "queue-1")
	if err := conn.Connect(); err != nil {
		panic(err)
	}
	if err := conn.BindQueue(); err != nil {
		panic(err)
	}

	//var msgList []MessageRequest
	for _, r := range executionsRequest {
		exec := MessagesExecutionHistory{
			ID:           uuid.New(),
			ExecutionId:  r.ExecutionId,
			ExecutionLog: nil, //TODO
			Status:       nil, //TODO
			LoggedAt:     time.Now(),
		}
		executions = append(executions, exec)
	}
	byteM, err := util.GetBytes(executions)
	if err != nil {
		return Response{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Save.GetBytes")
	}
	m := Message{
		Queue:         conn.Queues,
		ReplyTo:       "",
		ContentType:   "text/plain",
		CorrelationID: uuid.New().String(),
		Priority:      0,
		Body: MessageBody{
			Data: byteM,
			Type: "",
		},
	}
	if err := conn.Publish(m); err != nil {
		panic(err)
	}


	result := main.db.Model(&MessagesExecutionHistory{}).Create(&executions)
	if result.Error != nil {
		return Response{}, errors.NewError("Save Message Execution error", result.Error.Error()).
			WithOperations("Save.Result")
	}

	return Response{executions[0].ID}, nil
}
