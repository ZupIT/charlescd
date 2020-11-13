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

package metric

import (
	"compass/internal/error"
	"compass/internal/util"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/sirupsen/logrus"
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

func (main Main) FindAllMetricExecutions() ([]MetricExecution, *error.Error) {
	var metricExecutions []MetricExecution
	db := main.db.Find(&metricExecutions)
	if db.Error != nil {
		return []MetricExecution{}, error.New("metric.FindAllMetricExecutions", "", error.Unexpected, db.Error, logrus.ErrorLevel)
	}
	return metricExecutions, nil
}

func (main Main) UpdateMetricExecution(metricExecution MetricExecution) (MetricExecution, *error.Error) {
	db := main.db.Save(&metricExecution)
	if db.Error != nil {
		return MetricExecution{}, error.New("metric.UpdateMetricExecution", "", error.Unexpected, db.Error, logrus.ErrorLevel)
	}
	return metricExecution, nil
}

func (main Main) updateExecutionStatus(tx *gorm.DB, metricId uuid.UUID) *error.Error {
	db := tx.Model(&MetricExecution{}).Where("metric_id = ?", metricId).Update("status", MetricUpdated)
	if db.Error != nil {
		return error.New("metric.updateExecutionStatus", "", error.Unexpected, db.Error, logrus.ErrorLevel)
	}
	return nil
}

func (main Main) saveMetricExecution(tx *gorm.DB, execution MetricExecution) (MetricExecution, *error.Error) {
	db := tx.Save(&execution)
	if db.Error != nil {
		return MetricExecution{}, error.New("metric.saveMetricExecution", "", error.Unexpected, db.Error, logrus.ErrorLevel)
	}
	return execution, nil
}

func (main Main) removeMetricExecution(tx *gorm.DB, id string) *error.Error {
	db := tx.Where("id = ?", id).Delete(MetricExecution{})
	if db.Error != nil {
		return error.New("metric.removeMetricExecution", "", error.Unexpected, db.Error, logrus.ErrorLevel)
	}
	return nil
}
