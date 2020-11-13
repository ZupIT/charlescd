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
	internalerror "compass/internal/error"
	"compass/internal/util"
	"compass/pkg/datasource"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"io"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/sirupsen/logrus"
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

func (main Main) Validate(metric Metric) *internalerror.Error {
	errs := internalerror.New("metric.Validate", "", internalerror.NotValid, nil, logrus.ErrorLevel)

	if metric.Nickname == "" {
		errs.WithField("name")
		errs.WithError(errors.New("Metric nickname is required"))
	}

	if metric.Query == "" && metric.Metric == "" {
		errs.WithField("query/metric")
		errs.WithError(errors.New("Metric name/query is required"))
	}

	if len(metric.Filters) > 0 {
		for _, filter := range metric.Filters {
			errs.Merge(validateMetricFilter(filter))
		}
	}

	if len(metric.GroupBy) > 0 {
		for _, groupBy := range metric.GroupBy {
			errs.Merge(validateMetricGroupBy(groupBy))
		}
	}

	_, err := main.ResultQuery(metric)
	if err != nil {
		errs.Merge(err)
	}

	if metric.Nickname != "" && len(metric.Nickname) > 100 {
		errs.WithField("nickname")
		errs.WithError(errors.New("100 Maximum length in Nickname"))
	}

	if metric.Metric != "" && len(metric.Metric) > 100 {
		errs.WithField("metric")
		errs.WithError(errors.New("100 Maximum length in Metric"))
	}

	return errs
}

func validateMetricFilter(metricFilter datasource.MetricFilter) *internalerror.Error {
	errs := internalerror.New("metric.validateMetricFilter", "", internalerror.NotValid, nil, logrus.ErrorLevel)

	if len(metricFilter.Field) > 100 {
		errs.WithField("filter-field")
		errs.WithError(errors.New("100 Maximum length in Filter Field"))
	}

	if len(metricFilter.Value) > 100 {
		errs.WithField("filter-value")
		errs.WithError(errors.New("100 Maximum length in Filter Value"))
	}

	return errs
}

func validateMetricGroupBy(metricGroupBy MetricGroupBy) *internalerror.Error {
	errs := internalerror.New("metric.validateMetricGroupBy", "", internalerror.NotValid, nil, logrus.ErrorLevel)

	if len(metricGroupBy.Field) > 100 {
		errs.WithField("groupBy-field")
		errs.WithError(errors.New("100 Maximum length in GroupBy Field"))
	}

	return errs
}

func getFieldValidateByMetric(metric Metric) string {
	field := "metric"
	if metric.Query != "" {
		field = "query"
	}

	return field
}

func (main Main) ParseMetric(metric io.ReadCloser) (Metric, *internalerror.Error) {
	var newMetric *Metric
	err := json.NewDecoder(metric).Decode(&newMetric)
	if err != nil {
		return Metric{}, internalerror.New("metric.ParseMetric", "", internalerror.Unexpected, err, logrus.ErrorLevel)
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

func (main Main) FindMetricById(id string) (Metric, *internalerror.Error) {
	metric := Metric{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metric)
	if db.Error != nil {
		return Metric{}, internalerror.New("metric.FindMetricById", "", internalerror.Unexpected, db.Error, logrus.ErrorLevel)
	}
	return metric, nil
}

func (main Main) SaveMetric(metric Metric) (Metric, *internalerror.Error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := tx.Create(&metric)
		if db.Error != nil {
			return db.Error
		}

		_, err := main.saveMetricExecution(tx, MetricExecution{
			MetricID: metric.ID,
			Status:   MetricActive,
		})
		if err != nil {
			return err.Errors[0]
		}

		return nil
	})
	if err != nil {
		return Metric{}, internalerror.New("metric.SaveMetric", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	return metric, nil
}

func (main Main) UpdateMetric(id string, metric Metric) (Metric, *internalerror.Error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Save(&metric).Association("Filters").Replace(metric.Filters)
		if db.Error != nil {
			return db.Error
		}

		metric.MetricExecution.Status = MetricUpdated
		err := main.updateExecutionStatus(tx, metric.ID)
		if err != nil {
			return err.Errors[0]
		}

		return nil
	})

	if err != nil {
		return Metric{}, internalerror.New("metric.UpdateMetric", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	return metric, nil
}

func (main Main) RemoveMetric(id string) *internalerror.Error {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Delete(Metric{})
		if db.Error != nil {
			logger.Error(util.RemoveMetricError, "RemoveMetric", db.Error, id)
			return db.Error
		}

		err := main.removeMetricExecution(tx, id)
		if err != nil {
			return err.Errors[0]
		}

		return nil
	})
	if err != nil {
		return internalerror.New("metric.UpdateMetric", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}
	return nil
}

func (main Main) getQueryByMetric(metric Metric) []byte {
	if metric.Query != "" {
		return []byte(metric.Query)
	}

	return []byte(metric.Metric)
}

func (main Main) ResultQuery(metric Metric) (float64, *internalerror.Error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
	if err != nil {
		return 0, internalerror.New("metric.ResultQuery.FindById", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		return 0, internalerror.New("metric.ResultQuery.GetPluginBySrc", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	getQuery, err := plugin.Lookup("Result")
	if err != nil {
		return 0, internalerror.New("metric.ResultQuery.Lookup", "", internalerror.Unexpected, err, logrus.ErrorLevel)
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

	result, err := getQuery.(func(datasourceConfiguration, metric []byte, filters []datasource.MetricFilter) (float64, error))(dataSourceConfigurationData, query, metric.Filters)
	if err != nil {
		return 0, internalerror.New("metric.ResultQuery.getQuery", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	return result, nil
}

func (main Main) Query(metric Metric, period, interval string) (interface{}, *internalerror.Error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
	if err != nil {
		return nil, internalerror.New("metric.Query.FindById", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		return nil, internalerror.New("metric.Query.GetPluginBySrc", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	getQuery, err := plugin.Lookup("Query")
	if err != nil {
		return nil, internalerror.New("metric.Query.Lookup", "", internalerror.Unexpected, err, logrus.ErrorLevel)
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

	values, err := getQuery.(func(datasourceConfiguration, query, period, interval []byte, filters []datasource.MetricFilter) ([]datasource.Value, error))(dataSourceConfigurationData, query, []byte(period), []byte(interval), metric.Filters)

	if err != nil {
		return nil, internalerror.New("metric.Query.getQuery", "", internalerror.Unexpected, err, logrus.ErrorLevel)
	}

	return values, nil
}
