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
	"encoding/json"
	goErrors "errors"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MetricRepository interface {
	CountMetrics(metrics []domain.Metric) (int, int, int)
	FindMetricById(id uuid.UUID) (domain.Metric, error)
	SaveMetric(metric domain.Metric) (domain.Metric, error)
	UpdateMetric(metric domain.Metric) (domain.Metric, error)
	RemoveMetric(id uuid.UUID) error
	Query(metric domain.Metric, period, interval datasourcePKG.Period) (interface{}, error)
	ResultQuery(metric domain.Metric) (float64, error)
	UpdateMetricExecution(metricExecution domain.MetricExecution) (domain.MetricExecution, error)
	FindAllMetricExecutions() ([]domain.MetricExecution, error)
	ValidateIfExecutionReached(metric domain.MetricExecution) bool
	FindAllByGroup(metricGroupID uuid.UUID) ([]domain.Metric, error)
}

type metricRepository struct {
	db             *gorm.DB
	datasourceMain DatasourceRepository
	pluginMain     PluginRepository
}

func NewMetricRepository(
	db *gorm.DB, datasourceMain DatasourceRepository, pluginMain PluginRepository,
) MetricRepository {
	return metricRepository{db, datasourceMain, pluginMain}
}

func (main metricRepository) CountMetrics(metrics []domain.Metric) (int, int, int) {
	configuredMetrics := 0
	reachedMetrics := 0
	allMetrics := 0
	for _, metric := range metrics {
		if metric.Condition != "" {
			configuredMetrics++
		}

		if metric.MetricExecution.Status == MetricReached {
			reachedMetrics++
		}

		allMetrics++
	}

	return configuredMetrics, reachedMetrics, allMetrics
}

func (main metricRepository) FindMetricById(id uuid.UUID) (domain.Metric, error) {
	metric := models.Metric{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metric)
	if db.Error != nil {
		logger.Error(util.FindMetricById, "FindMetricById", db.Error, "Id = "+id)
		return domain.Metric{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("FindMetricById.First")
	}
	return mapper.MetricModelToDomain(metric), nil
}

func (main metricRepository) SaveMetric(metric domain.Metric) (domain.Metric, error) {

	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := tx.Create(&metric)
		if db.Error != nil {
			return logging.NewError(util.SaveMetricError, db.Error, nil, "MetricRepository.SaveMetric.Create")
		}

		_, err := main.saveMetricExecution(tx, domain.MetricExecution{MetricID: metric.ID, Status: MetricActive})
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return domain.Metric{}, logging.NewError("Save error", err, nil, "MetricRepository.SaveMetric.Transaction")
	}

	return metric, nil
}

func (main metricRepository) UpdateMetric(metric domain.Metric) (domain.Metric, error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		dbErr := main.db.Save(&metric).Association("Filters").Replace(metric.Filters)
		if dbErr != nil {
			logger.Error(util.UpdateMetricError, "UpdateMetric", dbErr, metric)
			return dbErr
		}

		metric.MetricExecution.Status = MetricUpdated
		err := main.updateExecutionStatus(tx, metric.ID)
		if err != nil {
			return goErrors.New(err.Error().Detail)
		}

		return nil
	})

	if err != nil {
		return domain.Metric{}, errors.NewError("Update error", err.Error()).
			WithOperations("UpdateMetric.Transaction")
	}

	return metric, nil
}

func (main metricRepository) RemoveMetric(id uuid.UUID) error {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Delete(domain.Metric{})
		if db.Error != nil {
			logger.Error(util.RemoveMetricError, "RemoveMetric", db.Error, id)
			return db.Error
		}

		err := main.removeMetricExecution(tx, id)
		if err != nil {
			return goErrors.New(err.Error().Detail)
		}

		return nil
	})
	if err != nil {
		return errors.NewError("Remove error", err.Error()).
			WithOperations("RemoveMetric.Transaction")
	}
	return nil
}

func (main metricRepository) getQueryByMetric(metric domain.Metric) string {
	if metric.Query != "" {
		return metric.Query
	}

	return metric.Metric
}

func (main metricRepository) ResultQuery(metric domain.Metric) (float64, error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID)
	if err != nil {
		return 0, err.WithOperations("ResultQuery.FindById")
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		return 0, err.WithOperations("ResultQuery.GetPluginBySrc")
	}

	getQuery, lookupErr := plugin.Lookup("Result")
	if lookupErr != nil {
		return 0, errors.NewError("Result error", lookupErr.Error()).
			WithOperations("ResultQuery.Lookup")
	}

	dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
	query := main.getQueryByMetric(metric)

	if metric.Query == "" {
		metric.Filters = append(metric.Filters, datasourcePKG.MetricFilter{
			Field:    "circle_source",
			Operator: "=",
			Value:    metric.CircleID.String(),
		})
	}

	result, castError := getQuery.(func(request datasourcePKG.ResultRequest) (float64, error))(datasourcePKG.ResultRequest{
		DatasourceConfiguration: dataSourceConfigurationData,
		Query:                   query,
		Filters:                 metric.Filters,
	})

	if castError != nil {
		return 0, errors.NewError("Result error", castError.Error()).
			WithOperations("ResultQuery.getQuery")
	}

	return result, nil
}

func (main metricRepository) Query(metric domain.Metric, period, interval datasourcePKG.Period) (interface{}, error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID)
	if err != nil {
		return nil, err.WithOperations("ResultQuery.FindById")
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		return nil, err.WithOperations("ResultQuery.GetPluginBySrc")
	}

	getQuery, lookupErr := plugin.Lookup("Query")
	if lookupErr != nil {
		return nil, errors.NewError("Query error", lookupErr.Error()).
			WithOperations("ResultQuery.Lookup")
	}

	query := main.getQueryByMetric(metric)
	dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)

	if metric.Query == "" {
		metric.Filters = append(metric.Filters, datasourcePKG.MetricFilter{
			Field:    "circle_source",
			Operator: "=",
			Value:    metric.CircleID.String(),
		})
	}

	queryResult, castErr := getQuery.(func(request datasourcePKG.QueryRequest) ([]datasourcePKG.Value, error))(datasourcePKG.QueryRequest{
		ResultRequest: datasourcePKG.ResultRequest{
			DatasourceConfiguration: dataSourceConfigurationData,
			Query:                   query,
			Filters:                 metric.Filters,
		},
		RangePeriod: period,
		Interval:    interval,
	})

	if castErr != nil {
		return nil,
			errors.NewError("Query error", castErr.Error()).
				WithOperations("ResultQuery.getQuery")
	}

	return queryResult, nil
}

func (main metricRepository) FindAllByGroup(metricGroupID uuid.UUID) ([]domain.Metric, error) {
	var metrics []domain.Metric
	result := main.db.Set("gorm:auto_preload", true).Where("metrics_group_id = ?", metricGroupID).Find(&metrics)
	if result.Error != nil {
		return nil, logging.NewError("Find Metrics By GroupId error", result.Error, nil, "MetricRepository.FindAllByGroup.Find")
	}

	return metrics, nil
}
