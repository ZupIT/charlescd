package metricsgroup

import (
	"compass/internal/util"
	"compass/pkg/datasource"
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

type MetricGroupResume struct {
	util.BaseModel
	Name                   string `json:"name"`
	AllMetricsCount        int    `json:"allMetricsCount"`
	AllMetricsSuccessCount int    `json:"allMetricsSuccessCount"`
}

func (metricsGroup MetricsGroup) Validate() []error {
	ers := make([]error, 0)

	if metricsGroup.Name == "" {
		ers = append(ers, errors.New("Name is required"))
	}

	if metricsGroup.CircleID == uuid.Nil {
		ers = append(ers, errors.New("CircleID is required"))
	}

	for _, m := range metricsGroup.Metrics {
		if len(m.Validate()) > 0 {
			ers = append(ers, m.Validate()...)
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

	if currentPeriod != "" && !reg.Match([]byte(currentPeriod)) {
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

func (main Main) getAllMetricsWithConditions(metrics []Metric) int {
	metricsWithConditions := 0
	for _, metric := range metrics {
		if metric.Condition != "" {
			metricsWithConditions++
		}
	}

	return metricsWithConditions
}

func (main Main) getAllMetricsFinished(metrics []Metric) int {
	metricsFinished := 0
	for _, metric := range metrics {
		if metric.Status == MetricFinished {
			metricsFinished++
		}
	}

	return metricsFinished
}

func (main Main) ResumeByCircle(circleId string) ([]MetricGroupResume, error) {
	var metricsGroups []MetricsGroup
	var metricsGroupsResume []MetricGroupResume

	circleIdParsed, _ := uuid.Parse(circleId)

	db := main.db.Set("gorm:auto_preload", true).Where(
		&MetricsGroup{CircleID: circleIdParsed},
	).Find(&metricsGroups)

	if db.Error != nil {
		return []MetricGroupResume{}, db.Error
	}

	for _, group := range metricsGroups {
		metricsGroupsResume = append(metricsGroupsResume, MetricGroupResume{
			group.BaseModel,
			group.Name,
			main.getAllMetricsWithConditions(group.Metrics),
			main.getAllMetricsFinished(group.Metrics),
		})
	}

	return metricsGroupsResume, nil
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
	db := main.db.Preload("Metrics").Where("status = ?", Active).Find(&metricsGroups)
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

func (main Main) Query(id, period string) ([]datasource.MetricValues, error) {
	var metricsValues []datasource.MetricValues
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

		metricsValues = append(metricsValues, datasource.MetricValues{
			Metric: metric.Metric,
			Values: query,
		})
	}

	return metricsValues, nil
}

func (main Main) ResultByGroup(group MetricsGroup) ([]datasource.MetricResult, error) {
	metricsResults := []datasource.MetricResult{}
	for _, metric := range group.Metrics {

		dataSourceResult, err := main.datasourceMain.FindById(metric.DataSourceID.String())
		if err != nil {
			return nil, errors.New("Not found data source: " + metric.DataSourceID.String())
		}

		plugin, err := main.pluginMain.GetPluginByID(dataSourceResult.PluginID.String())
		if err != nil {
			return nil, err
		}

		getQuery, err := plugin.Lookup("Result")
		if err != nil {
			return nil, err
		}

		dataSourceConfigurationData, _ := json.Marshal(dataSourceResult.Data)
		metricData, _ := json.Marshal(metric)
		result, err := getQuery.(func(datasourceConfiguration, metric []byte) (float64, error))(dataSourceConfigurationData, metricData)
		if err != nil {
			return nil, err
		}

		metricsResults = append(metricsResults, datasource.MetricResult{
			Metric: metric.Metric,
			Result: result,
		})
	}

	return metricsResults, nil
}

func (main Main) ResultByID(id string) ([]datasource.MetricResult, error) {
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return nil, errors.New("Not found metrics group: " + id)
	}

	return main.ResultByGroup(metricsGroup)
}
