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
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	MetricReached = "REACHED"
	MetricActive  = "ACTIVE"
	MetricError   = "ERROR"
	MetricUpdated = "UPDATED"
)

func (main metricRepository) FindAllMetricExecutions() ([]domain.MetricExecution, error) {
	var metricExecutions []models.MetricExecution
	db := main.db.Find(&metricExecutions)
	if db.Error != nil {
		return []domain.MetricExecution{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("FindAllMetricExecutions.Find")
	}
	return mapper.MetricExecutionModelToDomains(metricExecutions), nil
}

func (main metricRepository) UpdateMetricExecution(metricExecution domain.MetricExecution) (domain.MetricExecution, error) {
	db := main.db.Save(&metricExecution)
	if db.Error != nil {
		return domain.MetricExecution{}, errors.NewError("Update error", db.Error.Error()).
			WithOperations("UpdateMetricExecution.Save")
	}
	return metricExecution, nil
}

func (main metricRepository) updateExecutionStatus(tx *gorm.DB, metricId uuid.UUID) error {
	db := tx.Model(&models.MetricExecution{}).Where("metric_id = ?", metricId).Update("status", MetricUpdated)
	if db.Error != nil {
		return logging.NewError(util.UpdateMetricExecutionError, db.Error, nil, "MetricExecutionRepository.updateExecutionStatus.Update")
	}

	return nil
}

func (main metricRepository) saveMetricExecution(tx *gorm.DB, execution domain.MetricExecution) (domain.MetricExecution, error) {
	db := tx.Save(&execution)
	if db.Error != nil {
		return domain.MetricExecution{}, logging.NewError(util.SaveMetricExecutionError, db.Error, nil, "MetricExecutionRepository.saveMetricExecution.Save")
	}

	return execution, nil
}

func (main metricRepository) removeMetricExecution(tx *gorm.DB, id uuid.UUID) error {
	db := tx.Where("id = ?", id).Delete(models.MetricExecution{})
	if db.Error != nil {
		return logging.NewError(util.SaveMetricExecutionError, db.Error, nil, "MetricExecutionRepository.saveMetricExecution.Save")
	}
	return nil
}

func (main metricRepository) ValidateIfExecutionReached(metricExecution domain.MetricExecution) bool {
	return metricExecution.Status == MetricReached
}
