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

package metricsgroup

import (
	"encoding/json"

	"io"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type MetricsGroup struct {
	util.BaseModel
	Name        string                                  `json:"name"`
	Metrics     []metric.Metric                         `json:"metrics"`
	WorkspaceID uuid.UUID                               `json:"-"`
	CircleID    uuid.UUID                               `json:"circleId"`
	Actions     []metricsgroupaction.MetricsGroupAction `json:"actions"`
	DeletedAt   *time.Time                              `json:"-"`
}

type MetricsGroupRepresentation struct {
	ID      uuid.UUID                                             `json:"id"`
	Name    string                                                `json:"name"`
	Metrics []metric.Metric                                       `json:"metrics"`
	Actions []metricsgroupaction.GroupActionExecutionStatusResume `json:"actions"`
}

type MetricGroupResume struct {
	util.BaseModel
	Name              string `json:"name"`
	Thresholds        int    `json:"thresholds"`
	ThresholdsReached int    `json:"thresholdsReached"`
	Metrics           int    `json:"metricsCount"`
	Status            string `json:"status"`
}

func (main Main) Validate(metricsGroup MetricsGroup) errors.ErrorList {
	ers := errors.NewErrorList()

	if strings.TrimSpace(metricsGroup.Name) == "" {
		err := errors.NewError("Invalid data", "Name is required").WithMeta("field", "name").WithOperations("Validate.NameTrimSpace")
		ers.Append(err)

	} else if len(metricsGroup.Name) > 64 {
		err := errors.NewError("Invalid data", "64 Maximum length in Name").WithMeta("field", "name").WithOperations("Validate.NameMaximumLength")
		ers.Append(err)
	}

	if metricsGroup.CircleID == uuid.Nil {
		err := errors.NewError("Invalid data", "CircleID is required").WithMeta("field", "circleID").WithOperations("Validate.RequiredCircleID")
		ers.Append(err)
	}

	if metricsGroup.WorkspaceID == uuid.Nil {
		err := errors.NewError("Invalid data", "WorkspaceID is required").WithMeta("field", "workspaceID").WithOperations("Validate.RequiredWorkspaceID")
		ers.Append(err)
	}

	return ers
}

type Condition int

const (
	Equal Condition = iota
	GreaterThan
	LowerThan
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
	return [...]string{"Equal", "GreaterThan", "LowerThan"}[c]
}

func (main Main) PeriodValidate(currentPeriod string) (datasource.Period, errors.Error) {
	reg, err := regexp.Compile("[0-9]")
	if err != nil {
		return datasource.Period{}, errors.NewError("Invalid period", "Invalid period or interval").
			WithOperations("PeriodValidate.RegexCompile")
	}

	if currentPeriod != "" && !reg.Match([]byte(currentPeriod)) {
		return datasource.Period{}, errors.NewError("Invalid period", "Invalid period or interval: not found number").
			WithOperations("PeriodValidate.RegexMatch")
	}

	unit := reg.ReplaceAllString(currentPeriod, "")
	_, ok := Periods[unit]
	if !ok && currentPeriod != "" {
		return datasource.Period{}, errors.NewError("Invalid period", "Invalid period or interval: not found unit").
			WithOperations("PeriodValidate.ReplaceAllString")
	}

	valueReg := regexp.MustCompile("[A-Za-z]").Split(currentPeriod, -1)

	value, err := strconv.Atoi(valueReg[0])
	if err != nil {
		return datasource.Period{}, errors.NewError("Invalid period", err.Error()).
			WithOperations("ReplaceAllString.Atoi")
	}

	return datasource.Period{
		Value: int64(value),
		Unit:  unit,
	}, nil
}

func (main Main) Parse(metricsGroup io.ReadCloser) (MetricsGroup, errors.Error) {
	var newMetricsGroup *MetricsGroup
	err := json.NewDecoder(metricsGroup).Decode(&newMetricsGroup)
	if err != nil {
		return MetricsGroup{}, errors.NewError("Cannot decode data", err.Error()).
			WithOperations("Parse.JSONDecode")
	}

	newMetricsGroup.Name = strings.TrimSpace(newMetricsGroup.Name)
	return *newMetricsGroup, nil
}

func (main Main) FindAll() ([]MetricsGroup, errors.Error) {
	var metricsGroups []MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, errors.NewError("FindAll error", db.Error.Error()).
			WithOperations("FindAll.DBFind")
	}
	return metricsGroups, nil
}

func (main Main) FindAllByWorkspaceID(workspaceID uuid.UUID) ([]MetricsGroup, errors.Error) {
	var metricsGroups []MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Where("workspace_id=?", workspaceID).Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, errors.NewError("FindAllByWorkspaceID error", db.Error.Error()).
			WithOperations("FindAllByWorkspaceID.DBFind")
	}
	return metricsGroups, nil
}

func (main Main) isMetricError(metrics []metric.Metric) bool {
	for _, currentMetric := range metrics {
		if currentMetric.MetricExecution.Status == metric.MetricError {
			return true
		}
	}

	return false
}

func (main Main) getResumeStatusByGroup(reachedMetrics, configuredMetrics int, metrics []metric.Metric) string {
	if main.isMetricError(metrics) {
		return metric.MetricError
	}

	if reachedMetrics == configuredMetrics && reachedMetrics > 0 {
		return metric.MetricReached
	}

	return metric.MetricActive
}

func (main Main) ResumeByCircle(circleID string) ([]MetricGroupResume, errors.Error) {
	var db *gorm.DB
	var metricsGroups []MetricsGroup
	var metricsGroupsResume []MetricGroupResume

	if circleID == "" {
		db = main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	} else {
		circleIDParsed, _ := uuid.Parse(circleID)
		db = main.db.Set("gorm:auto_preload", true).Where("circle_id=?", circleIDParsed).Find(&metricsGroups)
	}

	if db.Error != nil {
		return []MetricGroupResume{}, errors.NewError("ResumeByCircle error", db.Error.Error()).
			WithOperations("ResumeByCircle.DBFind")
	}

	for _, group := range metricsGroups {
		configuredMetrics, reachedMetrics, allMetrics := main.metricMain.CountMetrics(group.Metrics)
		metricsGroupsResume = append(metricsGroupsResume, MetricGroupResume{
			group.BaseModel,
			group.Name,
			configuredMetrics,
			reachedMetrics,
			allMetrics,
			main.getResumeStatusByGroup(reachedMetrics, configuredMetrics, group.Metrics),
		})
	}

	main.sortResumeMetrics(metricsGroupsResume)

	return metricsGroupsResume, nil
}

func (main Main) sortResumeMetrics(metricsGroupResume []MetricGroupResume) {

	sort.SliceStable(metricsGroupResume, func(i, j int) bool {

		if (metricsGroupResume[i].ThresholdsReached == metricsGroupResume[i].Thresholds) &&
			(metricsGroupResume[j].ThresholdsReached == metricsGroupResume[j].Thresholds) &&
			(metricsGroupResume[i].ThresholdsReached > metricsGroupResume[j].ThresholdsReached) {
			return true
		}

		if metricsGroupResume[i].Thresholds == 0 {
			return false
		}

		if metricsGroupResume[j].Thresholds == 0 {
			return true
		}

		if metricsGroupResume[i].ThresholdsReached == metricsGroupResume[i].Thresholds {
			return true
		}

		if metricsGroupResume[j].ThresholdsReached == metricsGroupResume[j].Thresholds {
			return false
		}

		if metricsGroupResume[i].ThresholdsReached == 0 && metricsGroupResume[j].ThresholdsReached == 0 {
			return metricsGroupResume[i].Thresholds > metricsGroupResume[j].Thresholds
		}

		return metricsGroupResume[i].ThresholdsReached > metricsGroupResume[j].ThresholdsReached

	})
}

func (main Main) Save(metricsGroup MetricsGroup) (MetricsGroup, errors.Error) {
	db := main.db.Create(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, errors.NewError("Save error", db.Error.Error()).
			WithOperations("Save.Create")
	}
	return metricsGroup, nil
}

func (main Main) FindByID(id string) (MetricsGroup, errors.Error) {
	metricsGroup := MetricsGroup{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, errors.NewError("Find Metric Group By ID error", db.Error.Error()).
			WithOperations("FindByID.First")
	}
	return metricsGroup, nil
}

func (main Main) ListAllByCircle(circleID string) ([]MetricsGroupRepresentation, errors.Error) {
	var metricsGroups []MetricsGroupRepresentation
	db := main.db.Table("metrics_groups").Select([]string{"name", "id"}).Where("circle_id = ? and deleted_at is null", circleID).Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroupRepresentation{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("ListAllByCircle.Find")
	}

	for idx := range metricsGroups {
		actionResume, err := main.groupActionsMain.ListGroupActionExecutionResumeByGroup(metricsGroups[idx].ID.String())
		if err != nil {
			return []MetricsGroupRepresentation{}, err.WithOperations("ListAllByCircle.ListGroupActionExecutionResumeByGroup")
		}
		metrics, err := main.metricMain.FindAllByGroup(metricsGroups[idx].ID.String())
		if err != nil {
			return nil, err.WithOperations("ListAllByCircle.FindAllByGroup")
		}
		metricsGroups[idx].Actions = actionResume
		metricsGroups[idx].Metrics = metrics
	}

	return metricsGroups, nil
}

func (main Main) Update(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, errors.NewError("Update error", db.Error.Error()).
			WithOperations("Update.Update")
	}
	return metricsGroup, nil
}

func (main Main) UpdateName(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update("name", metricsGroup.Name)
	if db.Error != nil {
		return MetricsGroup{}, errors.NewError("UpdateName error", db.Error.Error()).
			WithOperations("UpdateName.Update")
	}
	return metricsGroup, nil
}

func (main Main) Remove(id string) errors.Error {
	db := main.db.Where("id = ?", id).Delete(MetricsGroup{})
	if db.Error != nil {
		return errors.NewError("Remove error", db.Error.Error()).
			WithOperations("Remove.Delete")
	}
	return nil
}

func (main Main) QueryByGroupID(id string, period, interval datasource.Period) ([]datasource.MetricValues, errors.Error) {
	var metricsValues []datasource.MetricValues
	metricsGroup, err := main.FindByID(id)
	if err != nil {
		return []datasource.MetricValues{}, errors.NewError("Not found", "Not found metrics group: "+id).
			WithOperations("QueryByGroupID.FindByID")
	}

	if len(metricsGroup.Metrics) == 0 {
		return []datasource.MetricValues{}, nil
	}

	for _, metr := range metricsGroup.Metrics {

		query, err := main.metricMain.Query(metr, period, interval)
		if err != nil {
			return []datasource.MetricValues{}, err.WithOperations("QueryByGroupID.Query")
		}

		metricsValues = append(metricsValues, datasource.MetricValues{
			ID:       metr.ID,
			Nickname: metr.Nickname,
			Values:   query,
		})
	}

	return metricsValues, nil
}

func (main Main) ResultByGroup(group MetricsGroup) ([]datasource.MetricResult, errors.Error) {
	var metricsResults []datasource.MetricResult
	for _, metr := range group.Metrics {

		result, err := main.metricMain.ResultQuery(metr)
		if err != nil {
			return nil, err.WithOperations("ResultByGroup.ResultQuery")
		}

		metricsResults = append(metricsResults, datasource.MetricResult{
			ID:       metr.ID,
			Nickname: metr.Nickname,
			Result:   result,
		})
	}

	return metricsResults, nil
}

func (main Main) ResultByID(id string) ([]datasource.MetricResult, errors.Error) {
	metricsGroup, err := main.FindByID(id)
	if err != nil {
		return []datasource.MetricResult{}, errors.NewError("Not found", "Not found metrics group: "+id).
			WithOperations("ResultByID.FindByID")
	}

	return main.ResultByGroup(metricsGroup)
}
