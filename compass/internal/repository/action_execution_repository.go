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
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

const (
	notExecuted      = "NOT_EXECUTED"
	executionSuccess = "SUCCESS"
	inExecution      = "IN_EXECUTION"
	executionFailed  = "FAILED"
)

type ActionExecutionRepository interface {
	CreateNewExecution(groupActionID uuid.UUID) (domain.ActionsExecutions, error)
	SetExecutionFailed(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error)
	SetExecutionSuccess(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error)
	GetNumberOfActionExecutions(groupActionID uuid.UUID) (int64, error)
}

type actionExecutionRepository struct {
	db *gorm.DB
}

func NewActionExecutionRepository(db *gorm.DB) ActionExecutionRepository {
	return actionExecutionRepository{
		db: db,
	}
}

func (main actionExecutionRepository) CreateNewExecution(groupActionID uuid.UUID) (domain.ActionsExecutions, error) {
	timeNow := time.Now()

	execution := models.ActionsExecutions{
		Status:        inExecution,
		StartedAt:     &timeNow,
		GroupActionId: groupActionID,
	}

	db := main.db.Create(&execution)
	if db.Error != nil {
		return domain.ActionsExecutions{}, logging.NewError("Create error", db.Error, nil, "ActionExecutionRepository.CreateNewExecution.Create")
	}

	return mapper.ActionExecutionModelToDomain(execution), nil
}

func (main actionExecutionRepository) SetExecutionFailed(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error) {
	execution, err := main.findExecutionById(actionExecutionID)
	if err != nil {
		return domain.ActionsExecutions{}, logging.WithOperation(err, "ActionExecutionRepository.SetExecutionFailed")
	}

	if !validateActionCanFinish(execution) {
		return domain.ActionsExecutions{}, logging.NewError("Set Execution error", errors.New("cannot change status of a not in_execution action"), nil, "ActionExecutionRepository.SetExecutionFailed.validateActionCanFinish")
	}

	timeNow := time.Now()
	execution.Status = executionFailed
	execution.FinishedAt = &timeNow
	execution.ExecutionLog = executionLog

	result := main.db.Save(&execution)
	if result.Error != nil {
		return domain.ActionsExecutions{}, logging.NewError("Set execution error", result.Error, nil, "ActionExecutionRepository.SetExecutionFailed.Save")
	}

	return execution, nil
}

func (main actionExecutionRepository) SetExecutionSuccess(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error) {
	execution, err := main.findExecutionById(actionExecutionID)
	if err != nil {
		return domain.ActionsExecutions{}, logging.WithOperation(err, "ActionExecutionRepository.SetExecutionSuccess")
	}

	if !validateActionCanFinish(execution) {
		return domain.ActionsExecutions{}, logging.NewError("Set Execution error", errors.New("cannot change status of a not in_execution action"), nil, "ActionExecutionRepository.SetExecutionSuccess.validateActionCanFinish")
	}

	execution.Status = executionSuccess
	timeNow := time.Now()
	execution.FinishedAt = &timeNow
	execution.ExecutionLog = executionLog

	result := main.db.Save(&execution)
	if result.Error != nil {
		return domain.ActionsExecutions{}, logging.NewError("Set execution error", result.Error, nil, "ActionExecutionRepository.SetExecutionSuccess.Save")
	}

	return execution, nil
}

func (main actionExecutionRepository) GetNumberOfActionExecutions(groupActionID uuid.UUID) (int64, error) {
	var count int64

	result := main.db.Table("actions_executions").Where("group_action_id = ?", groupActionID).Count(&count)
	if result.Error != nil {
		return 0, logging.NewError("Get number error", result.Error, nil, "ActionExecutionRepository.GetNumberOfActionExecutions.Count")
	}

	return count, nil
}

func (main actionExecutionRepository) findExecutionById(actionExecutionID uuid.UUID) (domain.ActionsExecutions, error) {
	var execution models.ActionsExecutions

	result := main.db.Where("id = ?", actionExecutionID).Find(&execution)
	if result.Error != nil {
		return domain.ActionsExecutions{}, logging.NewError("Find error", result.Error, nil, "ActionExecutionRepository.FindExecutionById.Find")
	}

	return mapper.ActionExecutionModelToDomain(execution), nil
}

func validateActionCanFinish(execution domain.ActionsExecutions) bool {
	return execution.Status == inExecution
}
