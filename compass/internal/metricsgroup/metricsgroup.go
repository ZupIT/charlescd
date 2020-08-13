package metricsgroup

import (
	"compass/internal/util"
	"encoding/json"
	"errors"
	"io"
	"regexp"

	"github.com/google/uuid"
)

const (
	Active    = "ACTIVE"
	Completed = "COMPLETED"
)

type MetricsGroup struct {
	util.BaseModel
	Name        string    `json:"name"`
	Metrics     []Metric  `json:"metrics"`
	Status      string    `json:"status"`
	WorkspaceID uuid.UUID `json:"-"`
	CircleID    uuid.UUID `json:"circleId"`
}

type MetricResult struct {
	Metric string      `json:"metric"`
	Result interface{} `json:"result"`
}

func (metricsGroup MetricsGroup) Validate() []error {
	ers := make([]error, 0)

	if metricsGroup.Name == "" {
		ers = append(ers, errors.New("Name is required"))
	}

	if metricsGroup.Metrics == nil || len(metricsGroup.Metrics) == 0 {
		ers = append(ers, errors.New("Metrics is required"))
	}

	if metricsGroup.CircleID == uuid.Nil {
		ers = append(ers, errors.New("CircleID is required"))
	}

	for _, m := range metricsGroup.Metrics {
		if m.Validate() != nil {
			ers = append(ers, m.Validate())
		}
	}

	return ers
}

type Condition int

const (
	EQUAL Condition = iota
	GREATER_THEN
	LOWER_THEN
)

var Periods = map[string]string{
	"s":   "s",
	"m":   "m",
	"h":   "h",
	"d":   "d",
	"w":   "w",
	"y":   "y",
	"MAX": "MAX",
}

func (c Condition) String() string {
	return [...]string{"EQUAL", "GREATER_THEN", "LOWER_THEN"}[c]
}

func (main Main) PeriodValidate(currentPeriod string) error {
	reg, err := regexp.Compile("[0-9]")
	if err != nil {
		return err
	}

	if !reg.Match([]byte(currentPeriod)) {
		return errors.New("Invalid period: not found number")
	}

	unit := reg.ReplaceAllString(currentPeriod, "")
	_, ok := Periods[unit]
	if !ok && currentPeriod != "" {
		return errors.New("Invalid period: not found unit")
	}

	return nil
}

func (main Main) Parse(metricsGroup io.ReadCloser) (MetricsGroup, error) {
	var newMetricsGroup *MetricsGroup
	err := json.NewDecoder(metricsGroup).Decode(&newMetricsGroup)
	if err != nil {
		return MetricsGroup{}, err
	}
	return *newMetricsGroup, nil
}

func (main Main) FindAll() ([]MetricsGroup, error) {
	var metricsGroups []MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, db.Error
	}
	return metricsGroups, nil
}

func (main Main) Save(metricsGroup MetricsGroup) (MetricsGroup, error) {
	metricsGroup.Status = Active
	for i := 0; i < len(metricsGroup.Metrics); i++ {
		metricsGroup.Metrics[i].Status = Active
	}
	db := main.db.Create(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) FindById(id string) (MetricsGroup, error) {
	metricsGroup := MetricsGroup{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) FindActiveMetricGroups() ([]MetricsGroup, error) {
	var metricsGroups []MetricsGroup
	db := main.db.Preload("Metrics").Where("status = ?", Active).First(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, db.Error
	}
	return metricsGroups, nil
}

func (main Main) Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update(&metricsGroup)
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

func (main Main) Query(id, period string) ([]MetricResult, error) {
	metricsResults := []MetricResult{}
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return nil, errors.New("Not found metrics group: " + id)
	}

	for _, metric := range metricsGroup.Metrics {

		dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
		if err != nil {
			return nil, errors.New("Not found data source: " + metric.DataSourceID.String())
		}

		plugin, err := main.pluginMain.GetPluginByID(dataSourceResult.PluginID.String())
		if err != nil {
			return nil, err
		}

		getQuery, err := plugin.Lookup("Query")
		if err != nil {
			return nil, err
		}

		dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
		metricData, _ := json.Marshal(metric)
		query, err := getQuery.(func(datasourceConfiguration, metric, period []byte) (interface{}, error))(dataSourceConfigurationData, metricData, []byte(period))
		if err != nil {
			return nil, err
		}

		metricsResults = append(metricsResults, MetricResult{
			Metric: metric.Metric,
			Result: query,
		})
	}

	return metricsResults, nil
}
