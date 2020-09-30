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
	"errors"
	"fmt"
	"github.com/google/uuid"
	"time"
)

const (
	ExecutionSuccess = "SUCCESS"
	InExecution      = "IN_EXECUTION"
	ExecutionFailed  = "FAILED"
)

type ActionsExecutions struct {
	util.BaseModel
	MetricActionId string    `json:"metricActionId"`
	ExecutionLog   string    `json:"executionLog"`
	Status         string    `json:"status"`
	StartedAt      time.Time `json:"startedAt"`
	FinishedAt     time.Time `json:"finishedAt"`
}

func (main Main) FindExecutionById(actionExecutionID string) (ActionsExecutions, error) {
	var execution ActionsExecutions
	result := main.db.Table("action_executions").Where("id = ?", actionExecutionID).Find(&execution)

	if result.Error != nil {
		logger.Error(util.FindActionExecutionError, "FindActionExecution", result.Error, actionExecutionID)
		return ActionsExecutions{}, result.Error
	}

	return execution, nil
}

func (main Main) CreateNewExecution(metricActionID string) (ActionsExecutions, error) {
	execution := ActionsExecutions{
		Status:         InExecution,
		StartedAt:      time.Now(),
		MetricActionId: metricActionID,
	}
	db := main.db.Create(&execution)
	if db.Error != nil {
		logger.Error(util.CreateActionExecutionError, "CreateActionExecution", db.Error, nil)
		return ActionsExecutions{}, db.Error
	}
	return execution, nil
}

func (main Main) SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, error) {
	execution, err := main.FindExecutionById(actionExecutionID)
	if err != nil {
		logger.Error(util.SetExecutionFailedErrorFinding, "SetActionExecutionFailed", err, nil)
		return ActionsExecutions{}, err
	}

	if validateActionCanFinish(execution) {
		err = errors.New("cannot change status of a not in_execution action")
		logger.Error(util.ExecutionNotInExecution, "SetActionExecutionFailed", err, fmt.Sprintf("%+v", execution))
		return ActionsExecutions{}, err
	}

	execution.Status = ExecutionFailed
	execution.FinishedAt = time.Now()
	execution.ExecutionLog = executionLog
	result := main.db.Table("actions_executions").Where("id = ?", actionExecutionID).Update(&execution)
	if result.Error != nil {
		logger.Error(util.SetExecutionFailedError, "SetActionExecutionFailed", err, fmt.Sprintf("%+v", execution))
		return ActionsExecutions{}, err
	}

	return execution, nil
}

func (main Main) SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, error) {
	execution, err := main.FindExecutionById(actionExecutionID)
	if err != nil {
		logger.Error(util.SetExecutionSuccessErrorFinding, "SetActionExecutionSuccess", err, nil)
		return ActionsExecutions{}, err
	}

	if validateActionCanFinish(execution) {
		err = errors.New("cannot change status of a not in_execution action")
		logger.Error(util.ExecutionNotInExecution, "SetActionExecutionSuccess", err, fmt.Sprintf("%+v", execution))
		return ActionsExecutions{}, err
	}

	execution.Status = ExecutionSuccess
	execution.FinishedAt = time.Now()
	execution.ExecutionLog = executionLog
	result := main.db.Table("actions_executions").Where("id = ?", actionExecutionID).Update(&execution)
	if result.Error != nil {
		logger.Error(util.SetExecutionSuccessError, "SetActionExecutionSuccess", err, fmt.Sprintf("%+v", execution))
		return ActionsExecutions{}, err
	}

	return execution, nil
}

func validateActionCanFinish(execution ActionsExecutions) bool {
	return execution.Status == InExecution
}

func (main Main) getNumberOfActionExecutions(metricActionID uuid.UUID) int64 {
	var count int64
	main.db.Table("actions_executions").Where("metric_action_id = ?", metricActionID).Count(&count)

	return count
}
