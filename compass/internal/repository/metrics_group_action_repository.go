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
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/repository/queries"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"sort"
)

type MetricsGroupActionRepository interface {
	FindGroupActionById(id uuid.UUID) (domain.MetricsGroupAction, error)
	SaveGroupAction(metricsGroupAction domain.MetricsGroupAction) (domain.MetricsGroupAction, error)
	ListGroupActionExecutionResumeByGroup(groupID uuid.UUID) ([]domain.GroupActionExecutionStatusResume, error)
	UpdateGroupAction(id uuid.UUID, metricsGroupAction domain.MetricsGroupAction) (domain.MetricsGroupAction, error)
	DeleteGroupAction(id uuid.UUID) error
	SetExecutionFailed(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error)
	SetExecutionSuccess(actionExecutionID uuid.UUID, executionLog string) (domain.ActionsExecutions, error)
	ValidateActionCanBeExecuted(metricsGroupAction domain.MetricsGroupAction) bool
	CreateNewExecution(groupActionID uuid.UUID) (domain.ActionsExecutions, error)
}

type metricsGroupActionRepository struct {
	db         *gorm.DB
	pluginRepo PluginRepository
	actionRepo ActionRepository
}

func NewMetricsGroupActionRepository(db *gorm.DB, pluginRepo PluginRepository, actionRepo ActionRepository) MetricsGroupActionRepository {
	return metricsGroupActionRepository{db, pluginRepo, actionRepo}
}

func (main metricsGroupActionRepository) SaveGroupAction(metricsGroupAction domain.MetricsGroupAction) (domain.MetricsGroupAction, error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		return domain.MetricsGroupAction{}, logging.NewError("Save error", db.Error, nil, "MetricGroupActionRepository.SaveGroupAction.Create")
	}

	return metricsGroupAction, nil
}

func (main metricsGroupActionRepository) UpdateGroupAction(id uuid.UUID, metricsGroupAction domain.MetricsGroupAction) (domain.MetricsGroupAction, error) {
	metricsGroupAction.BaseModel.ID = id

	db := main.db.Save(&metricsGroupAction)
	if db.Error != nil {
		return domain.MetricsGroupAction{}, logging.NewError("Update error", db.Error, nil, "MetricGroupActionRepository.UpdateGroupAction.Save")
	}

	return metricsGroupAction, nil
}

func (main metricsGroupActionRepository) FindGroupActionById(id uuid.UUID) (domain.MetricsGroupAction, error) {
	metricsGroupAction := models.MetricsGroupAction{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroupAction)
	if db.Error != nil {
		return domain.MetricsGroupAction{}, logging.NewError("Find error", db.Error, nil, "MetricGroupActionRepository.FindGroupActionById.First")
	}

	return mapper.MetricsGroupActionModelToDomain(metricsGroupAction), nil
}

func (main metricsGroupActionRepository) DeleteGroupAction(id uuid.UUID) error {
	db := main.db.Model(&models.MetricsGroupAction{}).Where("id = ?", id).Delete(&models.MetricsGroupAction{})
	if db.Error != nil {
		return logging.NewError("Delete error", db.Error, nil, "MetricGroupActionRepository.DeleteGroupAction.Delete")
	}

	return nil
}

func (main metricsGroupActionRepository) ListGroupActionExecutionResumeByGroup(groupID uuid.UUID) ([]domain.GroupActionExecutionStatusResume, error) {
	var executions []models.GroupActionExecutionStatusResume

	result := main.db.Raw(queries.GroupActionQuery, groupID).Find(&executions)
	if result.Error != nil {
		return nil, logging.NewError("List error", result.Error, nil, "MetricGroupActionRepository.ListGroupActionExecutionResumeByGroup.Find")
	}

	sort.Slice(executions, func(i, j int) bool {
		if executions[i].StartedAt == nil {
			return false
		} else if executions[j].StartedAt == nil {
			return true
		}

		return executions[i].StartedAt.After(*executions[j].StartedAt)
	})

	return mapper.GroupActionExecutionStatusResumeModelToDomains(executions), nil
}

func (main metricsGroupActionRepository) ValidateActionCanBeExecuted(metricsGroupAction domain.MetricsGroupAction) bool {
	count, err := main.getNumberOfActionExecutions(metricsGroupAction.ID)
	if err != nil {
		return false
	}

	return metricsGroupAction.ActionsConfiguration.Repeatable || int64(metricsGroupAction.ActionsConfiguration.NumberOfCycles) > count
}
