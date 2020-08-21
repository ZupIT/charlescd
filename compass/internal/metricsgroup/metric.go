package metricsgroup

import (
	"compass/internal/util"
	"encoding/json"
	"errors"
	"io"

	"github.com/google/uuid"
)

const (
	MetricActive   = "ACTIVE"
	MetricFinished = "FINISHED"
)

type Metric struct {
	util.BaseModel
	MetricsGroupID uuid.UUID       `json:"metricGroupId"`
	DataSourceID   uuid.UUID       `json:"dataSourceId"`
	Nickname       string          `json:"nickname"`
	Query          string          `json:"query"`
	Metric         string          `json:"metric"`
	Filters        []MetricFilter  `json:"filters"`
	GroupBy        []MetricGroupBy `json:"groupBy"`
	Condition      string          `json:"condition"`
	Threshold      float64         `json:"threshold"`
	Status         string          `json:"status"`
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

func (metric Metric) Validate() []error {
	ers := make([]error, 0)

	if metric.Nickname == "" {
		ers = append(ers, errors.New("Metric nickname is required"))
	}

	if metric.Metric == "" {
		ers = append(ers, errors.New("Metric name is required"))
	}

	return ers
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

func (main Main) SaveMetric(metric Metric) (Metric, error) {
	_, err := main.resultQuery(metric)
	if err != nil {
		util.Error(util.ResultQueryError, "SaveMetric", err, metric)
		return Metric{}, err
	}

	db := main.db.Create(&metric)
	if db.Error != nil {
		util.Error(util.SaveMetricError, "SaveMetric", db.Error, metric)
		return Metric{}, db.Error
	}
	return metric, nil
}

func (main Main) UpdateMetric(id string, metric Metric) (Metric, error) {
	db := main.db.Table("metrics").Where("id = ?", id).Update(&metric)
	if db.Error != nil {
		util.Error(util.UpdateMetricError, "UpdateMetric", db.Error, metric)
		return Metric{}, db.Error
	}
	return metric, nil
}

func (main Main) RemoveMetric(id string) error {
	db := main.db.Where("id = ?", id).Delete(Metric{})
	if db.Error != nil {
		util.Error(util.RemoveMetricError, "RemoveMetric", db.Error, id)
		return db.Error
	}
	return nil
}
