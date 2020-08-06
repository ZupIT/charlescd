package metricsgroup

import (
	"compass/util"
	"errors"

	"github.com/google/uuid"
)

type Metric struct {
	util.BaseModel
	MetricGroupID uuid.UUID       `json:"metricGroupId"`
	DataSourceID  uuid.UUID       `json:"dataSourceId"`
	Metric        string          `json:"metric"`
	Filters       []MetricFilter  `json:"filters"`
	GroupBy       []MetricGroupBy `json:"groupBy"`
	Condition     string          `json:"condition"`
	Threshold     float64         `json:"threshold"`
}

type MetricFilter struct {
	util.BaseModel
	MetricID uuid.UUID
	Field    string `json:"field"`
	Value    string `json:"value"`
	Operator string `json:"operator"`
}

type MetricGroupBy struct {
	util.BaseModel
	Field string `json:"field"`
}

func (metric Metric) Validate() error {
	if metric.Metric == "" {
		return errors.New("Metric is required")
	}

	if len(metric.Filters) <= 0 {
		return errors.New("Filters not empty")
	}

	return nil
}
