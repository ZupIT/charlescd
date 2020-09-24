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

package metricsgroupaction

import (
	"compass/internal/util"
	"compass/pkg/logger"
	"time"
)

type ActionsExecutions struct {
	util.BaseModel
	MetricActionId string     `json:"metricActionId"`
	Repeatable     bool       `json:"repeatable"`
	NumberOfCycles int8       `json:"numberOfCycles"`
	StartedAt      *time.Time `json:"startedAt"`
	FinishedAt     *time.Time `json:"finishedAt"`
}

func (main Main) SaveExecution(actionExecution ActionsExecutions) (ActionsExecutions, error) {
	db := main.db.Create(&actionExecution)
	if db.Error != nil {
		logger.Error(util.SaveActionExecutionError, "SaveActionExecution", db.Error, actionExecution)
		return ActionsExecutions{}, db.Error
	}
	return actionExecution, nil
}
