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

package metricsgroupaction

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"time"
)

const (
	executionSuccess = "SUCCESS"
	inExecution      = "IN_EXECUTION"
	executionFailed  = "FAILED"
)

type ActionsExecutions struct {
	util.BaseModel
	GroupActionID uuid.UUID  `json:"groupActionId"`
	ExecutionLog  string     `json:"executionLog"`
	Status        string     `json:"status"`
	StartedAt     *time.Time `json:"startedAt"`
	FinishedAt    *time.Time `json:"finishedAt"`
}

func (main Main) findExecutionByID(actionExecutionID string) (ActionsExecutions, errors.Error) {
	var execution ActionsExecutions
	result := main.db.Where("id = ?", actionExecutionID).Find(&execution)

	if result.Error != nil {
		return ActionsExecutions{}, errors.NewError("Find error", result.Error.Error()).
			WithOperations("findExecutionByID.Find")
	}

	return execution, nil
}

func (main Main) CreateNewExecution(groupActionID string) (ActionsExecutions, errors.Error) {
	timeNow := time.Now()
	parsedID, err := uuid.Parse(groupActionID)
	if err != nil {
		return ActionsExecutions{}, errors.NewError("Create error", err.Error()).
			WithOperations("CreateNewExecution.Parse")
	}

	execution := ActionsExecutions{
		Status:        inExecution,
		StartedAt:     &timeNow,
		GroupActionID: parsedID,
	}

	db := main.db.Create(&execution)
	if db.Error != nil {
		return ActionsExecutions{}, errors.NewError("Create error", db.Error.Error()).
			WithOperations("CreateNewExecution.Create")
	}
	return execution, nil
}

func (main Main) SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, errors.Error) {
	execution, err := main.findExecutionByID(actionExecutionID)
	if err != nil {
		return ActionsExecutions{}, err.WithOperations("SetExecutionFailed.findExecutionByID")
	}

	if !validateActionCanFinish(execution) {
		return ActionsExecutions{}, errors.NewError("Set error", "cannot change status of a not in_execution action").
			WithOperations("SetExecutionFailed.validateActionCanFinish")
	}

	timeNow := time.Now()
	execution.Status = executionFailed
	execution.FinishedAt = &timeNow
	execution.ExecutionLog = executionLog
	result := main.db.Save(&execution)
	if result.Error != nil {
		return ActionsExecutions{}, errors.NewError("Set error", result.Error.Error()).
			WithOperations("SetExecutionFailed.Save")
	}

	return execution, nil
}

func (main Main) SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, errors.Error) {
	execution, err := main.findExecutionByID(actionExecutionID)
	if err != nil {
		return ActionsExecutions{}, err.WithOperations("SetExecutionSuccess.findExecutionByID")
	}

	if !validateActionCanFinish(execution) {
		return ActionsExecutions{}, errors.NewError("Set error", "cannot change status of a not in_execution action").
			WithOperations("SetExecutionSuccess.validateActionCanFinish")
	}

	execution.Status = executionSuccess
	timeNow := time.Now()
	execution.FinishedAt = &timeNow
	execution.ExecutionLog = executionLog
	result := main.db.Save(&execution)
	if result.Error != nil {
		return ActionsExecutions{}, errors.NewError("Set error", result.Error.Error()).
			WithOperations("SetExecutionSuccess.save")
	}

	return execution, nil
}

func validateActionCanFinish(execution ActionsExecutions) bool {
	return execution.Status == inExecution
}

func (main Main) getNumberOfActionExecutions(groupActionID uuid.UUID) (int64, errors.Error) {
	var count int64
	result := main.db.Table("actions_executions").Where("group_action_id = ?", groupActionID).Count(&count)

	if result.Error != nil {
		return 0, errors.NewError("Get error", result.Error.Error()).
			WithOperations("getNumberOfActionExecutions.Count")
	}

	return count, nil
}
