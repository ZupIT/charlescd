package metric

import (
	"compass/internal/util"
	"encoding/json"
	"errors"
	"io"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type Metric struct {
	util.BaseModel
	MetricsGroupID  uuid.UUID       `json:"metricGroupId"`
	DataSourceID    uuid.UUID       `json:"dataSourceId"`
	Nickname        string          `json:"nickname"`
	Query           string          `json:"query"`
	Metric          string          `json:"metric"`
	Filters         []MetricFilter  `json:"filters"`
	GroupBy         []MetricGroupBy `json:"groupBy"`
	Condition       string          `json:"condition"`
	Threshold       float64         `json:"threshold"`
	MetricExecution MetricExecution `json:"execution"`
}

type MetricFilter struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field"`
	Value    string    `json:"value"`
	Operator string    `json:"operator"`
}

type MetricGroupBy struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field"`
}

func (main Main) Validate(metric Metric) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if metric.Nickname == "" {
		ers = append(ers, util.ErrorUtil{Field: "Name", Error: errors.New("Metric nickname is required").Error()})
	}

	if metric.Query == "" && metric.Metric == "" {
		ers = append(ers, util.ErrorUtil{Field: "Query/Metric", Error: errors.New("Metric name/query is required").Error()})
	}

	_, err := main.ResultQuery(metric)
	if err != nil {
		ers = append(ers, util.ErrorUtil{Field: getFieldValidateByMetric(metric), Error: err.Error()})

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
		util.Error(util.GeneralParseError, "ParseMetric", err, metric)
		return Metric{}, err
	}
	return *newMetric, nil
}

func (main Main) CountAllMetricsWithConditions(metrics []Metric) int {
	metricsWithConditions := 0
	for _, metric := range metrics {
		if metric.Condition != "" {
			metricsWithConditions++
		}
	}

	return metricsWithConditions
}

func (main Main) CountAllMetricsFinished(metrics []Metric) int {
	metricsFinished := 0
	for _, currentMetric := range metrics {
		if currentMetric.MetricExecution.Status == MetricReached {
			metricsFinished++
		}
	}

	return metricsFinished
}

func (main Main) CountAllMetricsInGroup(metrics []Metric) int {
	metricsTotal := 0
	for _, _ = range metrics {
		metricsTotal++
	}

	return metricsTotal
}

func (main Main) FindMetricById(id string) (Metric, error) {
	metric := Metric{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metric)
	if db.Error != nil {
		util.Error(util.FindMetricById, "FindMetricById", db.Error, "Id = "+id)
		return Metric{}, db.Error
	}
	return metric, nil
}

func (main Main) SaveMetric(metric Metric) (Metric, error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := tx.Create(&metric)
		if db.Error != nil {
			util.Error(util.SaveMetricError, "SaveMetric", db.Error, metric)
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
		util.Error(util.SaveMetricError, "SaveMetric", err, metric)
		return Metric{}, err
	}

	return metric, nil
}

func (main Main) UpdateMetric(id string, metric Metric) (Metric, error) {
	err := main.db.Transaction(func(tx *gorm.DB) error {
		db := main.db.Where("id = ?", id).Save(&metric).Association("Filters").Replace(metric.Filters)
		if db.Error != nil {
			util.Error(util.UpdateMetricError, "UpdateMetric", db.Error, metric)
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
			util.Error(util.RemoveMetricError, "RemoveMetric", db.Error, id)
			return db.Error
		}

		err := main.removeMetricExecution(tx, id)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		util.Error(util.RemoveMetricError, "RemoveMetric", err, id)
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
		util.Error(util.QueryFindDatasourceError, "ResultQuery", notFoundErr, metric.DataSourceID.String())
		return 0, notFoundErr
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		util.Error(util.QueryGetPluginError, "ResultQuery", err, dataSourceResult.PluginSrc)
		return 0, err
	}

	getQuery, err := plugin.Lookup("Result")
	if err != nil {
		util.Error(util.PluginLookupError, "ResultQuery", err, plugin)
		return 0, err
	}

	dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
	filters, _ := json.Marshal(metric.Filters)
	query := main.getQueryByMetric(metric)
	return getQuery.(func(datasourceConfiguration, metric, filters []byte) (float64, error))(dataSourceConfigurationData, query, filters)
}

func (main Main) Query(metric Metric, period string) (interface{}, error) {
	dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
	if err != nil {
		notFoundErr := errors.New("Not found data source: " + metric.DataSourceID.String())
		util.Error(util.QueryFindDatasourceError, "Query", notFoundErr, metric.DataSourceID.String())
		return nil, notFoundErr
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		util.Error(util.QueryGetPluginError, "Query", err, dataSourceResult.PluginSrc)
		return nil, err
	}

	getQuery, err := plugin.Lookup("Query")
	if err != nil {
		util.Error(util.PluginLookupError, "Query", err, plugin)
		return nil, err
	}

	query := main.getQueryByMetric(metric)
	dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
	filters, _ := json.Marshal(metric.Filters)
	return getQuery.(func(datasourceConfiguration, query, filters, period []byte) (interface{}, error))(dataSourceConfigurationData, query, filters, []byte(period))
}
