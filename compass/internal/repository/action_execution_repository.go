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

package repository

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"time"
)

const (
	notExecuted      = "NOT_EXECUTED"
	executionSuccess = "SUCCESS"
	inExecution      = "IN_EXECUTION"
	executionFailed  = "FAILED"
)

func (main metricsGroupActionRepository) findExecutionById(actionExecutionID string) (domain.ActionsExecutions, errors.Error) {
	var execution ActionsExecutions
	result := main.db.Where("id = ?", actionExecutionID).Find(&execution)

	if result.Error != nil {
		return domain.ActionsExecutions{}, errors.NewError("Find error", result.Error.Error()).
			WithOperations("findExecutionById.Find")
	}

	return execution, nil
}

func (main metricsGroupActionRepository) CreateNewExecution(groupActionID uuid.UUID) (domain.ActionsExecutions, error) {
	timeNow := time.Now()
	parsedID, err := uuid.Parse(groupActionID)
	if err != nil {
		return ActionsExecutions{}, errors.NewError("Create error", err.Error()).
			WithOperations("CreateNewExecution.Parse")
	}

	execution := ActionsExecutions{
		Status:        inExecution,
		StartedAt:     &timeNow,
		GroupActionId: parsedID,
	}

	db := main.db.Create(&execution)
	if db.Error != nil {
		return domain.ActionsExecutions{}, errors.NewError("Create error", db.Error.Error()).
			WithOperations("CreateNewExecution.Create")
	}
	return execution, nil
}

func (main metricsGroupActionRepository) SetExecutionFailed(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error) {
	execution, err := main.findExecutionById(actionExecutionID)
	if err != nil {
		return domain.ActionsExecutions{}, err.WithOperations("SetExecutionFailed.findExecutionById")
	}

	if !validateActionCanFinish(execution) {
		return domain.ActionsExecutions{}, errors.NewError("Set error", "cannot change status of a not in_execution action").
			WithOperations("SetExecutionFailed.validateActionCanFinish")
	}

	timeNow := time.Now()
	execution.Status = executionFailed
	execution.FinishedAt = &timeNow
	execution.ExecutionLog = executionLog
	result := main.db.Save(&execution)
	if result.Error != nil {
		return domain.ActionsExecutions{}, errors.NewError("Set error", result.Error.Error()).
			WithOperations("SetExecutionFailed.Save")
	}

	return execution, nil
}

func (main metricsGroupActionRepository) SetExecutionSuccess(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error) {
	execution, err := main.findExecutionById(actionExecutionID)
	if err != nil {
		return domain.ActionsExecutions{}, err.WithOperations("SetExecutionSuccess.findExecutionById")
	}

	if !validateActionCanFinish(execution) {
		return domain.ActionsExecutions{}, errors.NewError("Set error", "cannot change status of a not in_execution action").
			WithOperations("SetExecutionSuccess.validateActionCanFinish")
	}

	execution.Status = executionSuccess
	timeNow := time.Now()
	execution.FinishedAt = &timeNow
	execution.ExecutionLog = executionLog
	result := main.db.Save(&execution)
	if result.Error != nil {
		return domain.ActionsExecutions{}, errors.NewError("Set error", result.Error.Error()).
			WithOperations("SetExecutionSuccess.save")
	}

	return execution, nil
}

func validateActionCanFinish(execution domain.ActionsExecutions) bool {
	return execution.Status == inExecution
}

func (main metricsGroupActionRepository) getNumberOfActionExecutions(groupActionID uuid.UUID) (int64, error) {
	var count int64
	result := main.db.Table("actions_executions").Where("group_action_id = ?", groupActionID).Count(&count)
	if result.Error != nil {
		return 0, errors.NewError("Get error", result.Error.Error()).
			WithOperations("getNumberOfActionExecutions.Count")
	}

	return count, nil
}
