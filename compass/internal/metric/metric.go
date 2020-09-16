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
	"compass/internal/util"
	"compass/pkg/datasource"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"io"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type Metric struct {
	util.BaseModel
	MetricsGroupID  uuid.UUID                 `json:"metricGroupId"`
	DataSourceID    uuid.UUID                 `json:"dataSourceId"`
	Nickname        string                    `json:"nickname"`
	Query           string                    `json:"query"`
	Metric          string                    `json:"metric"`
	Filters         []datasource.MetricFilter `json:"filters"`
	GroupBy         []MetricGroupBy           `json:"groupBy"`
	Condition       string                    `json:"condition"`
	Threshold       float64                   `json:"threshold"`
	CircleID        uuid.UUID                 `json:"circleId"`
	MetricExecution MetricExecution           `json:"execution"`
}

type MetricGroupBy struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field"`
}

func (main Main) Validate(metric Metric) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if metric.Nickname == "" {
		ers = append(ers, util.ErrorUtil{Field: "name", Error: errors.New("Metric nickname is required").Error()})
	}

	if metric.Query == "" && metric.Metric == "" {
		ers = append(ers, util.ErrorUtil{Field: "query/metric", Error: errors.New("Metric name/query is required").Error()})
	}

	if len(metric.Filters) > 0 {
		for _, filter := range metric.Filters {
			ers = append(ers, validateMetricFilter(filter)...)
		}
	}

	if len(metric.GroupBy) > 0 {
		for _, groupBy := range metric.GroupBy {
			ers = append(ers, validateMetricGroupBy(groupBy)...)
		}
	}

	_, err := main.ResultQuery(metric)
	if err != nil {
		ers = append(ers, util.ErrorUtil{Field: getFieldValidateByMetric(metric), Error: err.Error()})

	}

	if metric.Nickname != "" && len(metric.Nickname) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "nickname", Error: errors.New("100 Maximum length in Nickname").Error()})
	}

	if metric.Metric != "" && len(metric.Metric) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "metric", Error: errors.New("100 Maximum length in Metric").Error()})
	}

	return ers
}

func validateMetricFilter(metricFilter datasource.MetricFilter) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if len(metricFilter.Field) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "filter-field", Error: errors.New("100 Maximum length in Filter Field").Error()})
	}

	if len(metricFilter.Value) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "filter-value", Error: errors.New("100 Maximum length in Filter Value").Error()})
	}

	return ers
}

func validateMetricGroupBy(metricGroupBy MetricGroupBy) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if len(metricGroupBy.Field) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "groupBy-field", Error: errors.New("100 Maximum length in GroupBy Field").Error()})
	}

	return ers
}

func getFieldValidateByMetric(metric Metric) string {
	field := "metric"
	if metric.Query != "" {
		field = "query"
	}

	return field
}

func (main Main) ParseMetric(metric io.ReadCloser) (Metric, error) {
	var newMetric *Metric
	err := json.NewDecoder(metric).Decode(&newMetric)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseMetric", err, metric)
		return Metric{}, err
	}
	return *newMetric, nil
}

func (main Main) CountMetrics(metrics []Metric) (int, int, int) {
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

func (main Main) FindMetricById(id string) (Metric, error) {
	metric := Metric{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metric)
	if db.Error != nil {
		logger.Error(util.FindMetricById, "FindMetricById", db.Error, "Id = "+id)
		return Metric{}, db.Error
	}
	return metric, nil
}

func (main Main) SaveMetric(metric Metric) (Metric, error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := tx.Create(&metric)
		if db.Error != nil {
			logger.Error(util.SaveMetricError, "SaveMetric", db.Error, metric)
			return db.Error
		}

		_, err := main.saveMetricExecution(tx, MetricExecution{
			MetricID: metric.ID,
			Status:   MetricActive,
		})
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		logger.Error(util.SaveMetricError, "SaveMetric", err, metric)
		return Metric{}, err
	}

	return metric, nil
}

func (main Main) UpdateMetric(id string, metric Metric) (Metric, error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Save(&metric).Association("Filters").Replace(metric.Filters)
		if db.Error != nil {
			logger.Error(util.UpdateMetricError, "UpdateMetric", db.Error, metric)
			return db.Error
		}

		metric.MetricExecution.Status = MetricUpdated
		err := main.updateExecutionStatus(tx, metric.ID)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return Metric{}, err
	}

	return metric, nil
}

func (main Main) RemoveMetric(id string) error {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Delete(Metric{})
		if db.Error != nil {
			logger.Error(util.RemoveMetricError, "RemoveMetric", db.Error, id)
			return db.Error
		}

		err := main.removeMetricExecution(tx, id)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		logger.Error(util.RemoveMetricError, "RemoveMetric", err, id)
		return err
	}
	return nil
}

func (main Main) getQueryByMetric(metric Metric) []byte {
	if metric.Query != "" {
		return []byte(metric.Query)
	}

	return []byte(metric.Metric)
}

func (main Main) ResultQuery(metric Metric) (float64, error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
	if err != nil {
		notFoundErr := errors.New("Not found data source: " + metric.DataSourceID.String())
		logger.Error(util.QueryFindDatasourceError, "ResultQuery", notFoundErr, metric.DataSourceID.String())
		return 0, notFoundErr
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "ResultQuery", err, dataSourceResult.PluginSrc)
		return 0, err
	}

	getQuery, err := plugin.Lookup("Result")
	if err != nil {
		logger.Error(util.PluginLookupError, "ResultQuery", err, plugin)
		return 0, err
	}

	dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
	query := main.getQueryByMetric(metric)

	if metric.Query == "" {
		metric.Filters = append(metric.Filters, datasource.MetricFilter{
			Field:    "circle_source",
			Operator: "=",
			Value:    metric.CircleID.String(),
		})
	}

	return getQuery.(func(datasourceConfiguration, metric []byte, filters []datasource.MetricFilter) (float64, error))(dataSourceConfigurationData, query, metric.Filters)
}

func (main Main) Query(metric Metric, period, interval string) (interface{}, error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
	if err != nil {
		notFoundErr := errors.New("Not found data source: " + metric.DataSourceID.String())
		logger.Error(util.QueryFindDatasourceError, "Query", notFoundErr, metric.DataSourceID.String())
		return nil, notFoundErr
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "Query", err, dataSourceResult.PluginSrc)
		return nil, err
	}

	getQuery, err := plugin.Lookup("Query")
	if err != nil {
		logger.Error(util.PluginLookupError, "Query", err, plugin)
		return nil, err
	}

	query := main.getQueryByMetric(metric)
	dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)

	if metric.Query == "" {
		metric.Filters = append(metric.Filters, datasource.MetricFilter{
			Field:    "circle_source",
			Operator: "=",
			Value:    metric.CircleID.String(),
		})
	}

	return getQuery.(func(datasourceConfiguration, query, period, interval []byte, filters []datasource.MetricFilter) ([]datasource.Value, error))(dataSourceConfigurationData, query, []byte(period), []byte(interval), metric.Filters)
}
