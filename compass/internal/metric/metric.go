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
	"encoding/json"
	goErrors "errors"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
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

func (main Main) Validate(metric Metric) errors.ErrorList {
	ers := errors.NewErrorList()

	if metric.Nickname == "" {
		err := errors.NewError("Invalid data", "metric nickname is required").
			WithMeta("field", "name").
			WithOperations("Validate.NicknameIsNil")
		ers.Append(err)
	}

	if metric.Query == "" && metric.Metric == "" {
		err := errors.NewError("Invalid data", "metric name/query is required").
			WithMeta("field", "query/metric").
			WithOperations("Validate.QueryOrMetricIsNil")
		ers.Append(err)
	}

	if len(metric.Filters) > 0 {
		for _, filter := range metric.Filters {
			ers.Append(validateMetricFilter(filter).GetErrors()...)
		}
	}

	if len(metric.GroupBy) > 0 {
		for _, groupBy := range metric.GroupBy {
			ers.Append(validateMetricGroupBy(groupBy).GetErrors()...)
		}
	}

	_, err := main.ResultQuery(metric)
	if err != nil {
		err := err.WithMeta("field", getFieldValidateByMetric(metric)).
			WithOperations("Validate.ResultQuery")
		ers.Append(err)
	}

	if metric.Nickname != "" && len(metric.Nickname) > 64 {
		err := errors.NewError("Invalid data", "64 Maximum length in Nickname").
			WithMeta("field", "nickname").
			WithOperations("Validate.NicknameLen")
		ers.Append(err)
	}

	if metric.Metric != "" && len(metric.Metric) > 64 {
		err := errors.NewError("Invalid data", "64 Maximum length in Metric").
			WithMeta("field", "metric").
			WithOperations("Validate.MetricLen")
		ers.Append(err)
	}

	return ers
}

func validateMetricFilter(metricFilter datasource.MetricFilter) errors.ErrorList {
	ers := errors.NewErrorList()

	if len(metricFilter.Field) > 100 {
		err := errors.NewError("Invalid data", "100 Maximum length in Filter Field").
			WithMeta("field", "filter-field").
			WithOperations("validateMetricFilter.MetricFilterLen")
		ers.Append(err)
	}

	if len(metricFilter.Value) > 100 {
		err := errors.NewError("Invalid data", "100 Maximum length in Filter Value").
			WithMeta("field", "filter-value").
			WithOperations("validateMetricFilter.MetricFilterValueLen")
		ers.Append(err)
	}

	return ers
}

func validateMetricGroupBy(metricGroupBy MetricGroupBy) errors.ErrorList {
	ers := errors.NewErrorList()

	if len(metricGroupBy.Field) > 100 {
		err := errors.NewError("Invalid data", "100 Maximum length in GroupBy Field").
			WithMeta("field", "groupBy-field").
			WithOperations("validateMetricFilter.MetricGroupByFieldLen")
		ers.Append(err)
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

func (main Main) ParseMetric(metric io.ReadCloser) (Metric, errors.Error) {
	var newMetric *Metric
	err := json.NewDecoder(metric).Decode(&newMetric)
	if err != nil {
		return Metric{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParseMetric.Decode")
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

func (main Main) FindMetricByID(id string) (Metric, errors.Error) {
	metric := Metric{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metric)
	if db.Error != nil {
		logger.Error(util.FindMetricByID, "FindMetricByID", db.Error, "ID = "+id)
		return Metric{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("FindMetricByID.First")
	}
	return metric, nil
}

func (main Main) SaveMetric(metric Metric) (Metric, errors.Error) {
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
			return goErrors.New(err.Error().Detail)
		}

		return nil
	})
	if err != nil {
		return Metric{}, errors.NewError("Save error", err.Error()).
			WithOperations("SaveMetric.Transaction")
	}

	return metric, nil
}

func (main Main) UpdateMetric(metric Metric) (Metric, errors.Error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Save(&metric).Association("Filters").Replace(metric.Filters)
		if db.Error != nil {
			logger.Error(util.UpdateMetricError, "UpdateMetric", db.Error, metric)
			return db.Error
		}

		metric.MetricExecution.Status = MetricUpdated
		err := main.updateExecutionStatus(tx, metric.ID)
		if err != nil {
			return goErrors.New(err.Error().Detail)
		}

		return nil
	})

	if err != nil {
		return Metric{}, errors.NewError("Update error", err.Error()).
			WithOperations("UpdateMetric.Transaction")
	}

	return metric, nil
}

func (main Main) RemoveMetric(id string) errors.Error {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Delete(Metric{})
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

func (main Main) getQueryByMetric(metric Metric) string {
	if metric.Query != "" {
		return metric.Query
	}

	return metric.Metric
}

func (main Main) ResultQuery(metric Metric) (float64, errors.Error) {
	dataSourceResult, err := main.datasourceMain.FindByID(metric.DataSourceID.String())
	if err != nil {
		return 0, err.WithOperations("ResultQuery.FindByID")
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
		metric.Filters = append(metric.Filters, datasource.MetricFilter{
			Field:    "circle_source",
			Operator: "=",
			Value:    metric.CircleID.String(),
		})
	}

	result, castError := getQuery.(func(request datasource.ResultRequest) (float64, error))(datasource.ResultRequest{
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

func (main Main) Query(metric Metric, period, interval datasource.Period) (interface{}, errors.Error) {
	dataSourceResult, err := main.datasourceMain.FindByID(metric.DataSourceID.String())
	if err != nil {
		return nil, err.WithOperations("ResultQuery.FindByID")
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
		metric.Filters = append(metric.Filters, datasource.MetricFilter{
			Field:    "circle_source",
			Operator: "=",
			Value:    metric.CircleID.String(),
		})
	}

	queryResult, castErr := getQuery.(func(request datasource.QueryRequest) ([]datasource.Value, error))(datasource.QueryRequest{
		ResultRequest: datasource.ResultRequest{
			DatasourceConfiguration: dataSourceConfigurationData,
			Query:                   query,
			Filters:                 metric.Filters,
		},
		RangePeriod: period,
		Interval:    interval,
	})

	if castErr != nil {
		return nil, errors.NewError("Query error", castErr.Error()).
			WithOperations("ResultQuery.getQuery")
	}

	return queryResult, nil
}

func (main Main) FindAllByGroup(metricGroupID string) ([]Metric, errors.Error) {
	var metrics []Metric
	result := main.db.Set("gorm:auto_preload", true).Where("metrics_group_id = ?", metricGroupID).Find(&metrics)
	if result.Error != nil {
		return nil, errors.NewError("Query error", result.Error.Error()).
			WithOperations("FindAllByGroup.Find")
	}

	return metrics, nil
}
