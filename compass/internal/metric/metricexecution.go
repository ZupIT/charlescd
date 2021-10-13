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

package metric

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

const (
	MetricReached = "REACHED"
	MetricActive  = "ACTIVE"
	MetricError   = "ERROR"
	MetricUpdated = "UPDATED"
)

type MetricExecution struct {
	util.BaseModel `json:"-"`
	MetricID       uuid.UUID `json:"-"`
	LastValue      float64   `json:"lastValue"`
	Status         string    `json:"status"`
}

func (main Main) FindAllMetricExecutions() ([]MetricExecution, errors.Error) {
	var metricExecutions []MetricExecution
	db := main.db.Find(&metricExecutions)
	if db.Error != nil {
		return []MetricExecution{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("FindAllMetricExecutions.Find")
	}
	return metricExecutions, nil
}

func (main Main) UpdateMetricExecution(metricExecution MetricExecution) (MetricExecution, errors.Error) {
	db := main.db.Save(&metricExecution)
	if db.Error != nil {
		return MetricExecution{}, errors.NewError("Update error", db.Error.Error()).
			WithOperations("UpdateMetricExecution.Save")
	}
	return metricExecution, nil
}

func (main Main) updateExecutionStatus(tx *gorm.DB, metricID uuid.UUID) errors.Error {
	db := tx.Model(&MetricExecution{}).Where("metric_id = ?", metricID).Update("status", MetricUpdated)
	if db.Error != nil {
		return errors.NewError("Update error", db.Error.Error()).
			WithOperations("updateExecutionStatus.Update")
	}
	return nil
}

func (main Main) saveMetricExecution(tx *gorm.DB, execution MetricExecution) (MetricExecution, errors.Error) {
	db := tx.Save(&execution)
	if db.Error != nil {
		return MetricExecution{}, errors.NewError("Save error", db.Error.Error()).
			WithOperations("saveMetricExecution.Save")
	}
	return execution, nil
}

func (main Main) removeMetricExecution(tx *gorm.DB, id string) errors.Error {
	db := tx.Where("id = ?", id).Delete(MetricExecution{})
	if db.Error != nil {
		return errors.NewError("Remove error", db.Error.Error()).
			WithOperations("removeMetricExecution.Delete")
	}
	return nil
}

func (main Main) ValidateIfExecutionReached(metricExecution MetricExecution) bool {
	return metricExecution.Status == MetricReached
}
