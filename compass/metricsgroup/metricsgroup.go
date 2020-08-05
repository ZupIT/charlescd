package metricsgroup

import (
	"compass/util"
	"encoding/json"
	"io"

	"github.com/google/uuid"
)

type MetricsGroup struct {
	util.BaseModel
	Name    string   `json:"name"`
	Metrics []Metric `json:"metrics"`
}

type Metric struct {
	util.BaseModel
	MetricGroupID uuid.UUID
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

const (
	EQUAL        = "EQUAL"
	GREATER_THEN = "GREATER_THEN"
	LOWER_THEN   = "LOWER_THEN"
)

func (main Main) Parse(metricsGroup io.ReadCloser) (MetricsGroup, error) {
	var newMetricsGroup *MetricsGroup
	err := json.NewDecoder(metricsGroup).Decode(&newMetricsGroup)
	if err != nil {
		return MetricsGroup{}, err
	}
	return *newMetricsGroup, nil
}

func (main Main) FindAll() ([]MetricsGroup, error) {
	metricsGroups := []MetricsGroup{}
	db := main.db.Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, db.Error
	}
	return metricsGroups, nil
}

func (main Main) Save(metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Create(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) FindById(id string) (MetricsGroup, error) {
	metricsGroup := MetricsGroup{}
	db := main.db.Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Where("id = ?", id).Update(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) Remove(id string) error {
	db := main.db.Where("id = ?", id).Delete(MetricsGroup{})
	if db.Error != nil {
		return db.Error
	}
	return nil
}
