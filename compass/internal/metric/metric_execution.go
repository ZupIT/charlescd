package metric

import (
	"compass/internal/util"
	"compass/pkg/logger"
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

func (main Main) FindAllMetricExecutions() ([]MetricExecution, error) {
	var metricExecutions []MetricExecution
	db := main.db.Find(&metricExecutions)
	if db.Error != nil {
		logger.Error(util.FindAllMetricExecutionsError, "FindAllMetricExecutions", db.Error, metricExecutions)
		return []MetricExecution{}, db.Error
	}
	return metricExecutions, nil
}

func (main Main) UpdateMetricExecution(metricExecution MetricExecution) (MetricExecution, error) {
	db := main.db.Save(&metricExecution)
	if db.Error != nil {
		logger.Error(util.UpdateMetricExecutionError, "UpdateMetricExecution", db.Error, metricExecution)
		return MetricExecution{}, db.Error
	}
	return metricExecution, nil
}

func (main Main) updateExecutionStatus(tx *gorm.DB, metricId uuid.UUID) error {
	db := tx.Model(&MetricExecution{}).Where("metric_id = ?", metricId).Update("status", MetricUpdated)
	if db.Error != nil {
		logger.Error(util.UpdateMetricExecutionError, "updateExecutionStatus", db.Error, metricId)
		return db.Error
	}
	return nil
}

func (main Main) saveMetricExecution(tx *gorm.DB, execution MetricExecution) (MetricExecution, error) {
	db := tx.Save(&execution)
	if db.Error != nil {
		logger.Error(util.SaveMetricExecutionError, "SaveMetricExecution", db.Error, execution)
		return MetricExecution{}, db.Error
	}
	return execution, nil
}

func (main Main) removeMetricExecution(tx *gorm.DB, id string) error {
	db := tx.Where("id = ?", id).Delete(MetricExecution{})
	if db.Error != nil {
		logger.Error(util.RemoveMetricExecutionError, "RemoveMetricExecution", db.Error, id)
		return db.Error
	}
	return nil
}
