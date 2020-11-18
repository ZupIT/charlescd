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

package metricsgroup

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"io"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

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

func (main Main) Validate(metricsGroup MetricsGroup) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	if strings.TrimSpace(metricsGroup.Name) == "" {
		ers = append(ers, util.ErrorUtil{Field: "name", Error: errors.New("name is required").Error()})
	} else if len(metricsGroup.Name) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "name", Error: errors.New("100 Maximum length in Name").Error()})
	}

	if metricsGroup.CircleID == uuid.Nil {
		ers = append(ers, util.ErrorUtil{Field: "circleID", Error: errors.New("CircleID is required").Error()})
	}

	if metricsGroup.WorkspaceID == uuid.Nil {
		ers = append(ers, util.ErrorUtil{Field: "workspaceID", Error: errors.New("workspaceID is required").Error()})
	}

	return ers
}

type Condition int

const (
	EQUAL Condition = iota
	GREATER_THAN
	LOWER_THAN
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
	return [...]string{"EQUAL", "GREATER_THAN", "LOWER_THAN"}[c]
}

func (main Main) PeriodValidate(currentPeriod string) (datasource.Period, error) {
	reg, err := regexp.Compile("[0-9]")
	if err != nil {
		logger.Error(util.PeriodValidateRegexError, "PeriodValidate", err, currentPeriod)
		return datasource.Period{}, errors.New("invalid period or interval")
	}

	if currentPeriod != "" && !reg.Match([]byte(currentPeriod)) {
		logger.Error(util.PeriodValidateError, "PeriodValidate", err, currentPeriod)
		return datasource.Period{}, errors.New("invalid period or interval: not found number")
	}

	unit := reg.ReplaceAllString(currentPeriod, "")
	_, ok := Periods[unit]
	if !ok && currentPeriod != "" {
		logger.Error(util.PeriodValidateError, "PeriodValidate", err, currentPeriod)
		return datasource.Period{}, errors.New("invalid period or interval: not found unit")
	}

	valueReg := regexp.MustCompile("[A-Za-z]").Split(currentPeriod, -1)

	value, err := strconv.Atoi(valueReg[0])
	if err != nil {
		return datasource.Period{}, err
	}

	return datasource.Period{
		Value: int64(value),
		Unit:  unit,
	}, nil
}

func (main Main) Parse(metricsGroup io.ReadCloser) (MetricsGroup, error) {
	var newMetricsGroup *MetricsGroup
	err := json.NewDecoder(metricsGroup).Decode(&newMetricsGroup)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, metricsGroup)
		return MetricsGroup{}, err
	}

	newMetricsGroup.Name = strings.TrimSpace(newMetricsGroup.Name)

	return *newMetricsGroup, nil
}

func (main Main) FindAll() ([]MetricsGroup, error) {
	var metricsGroups []MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	if db.Error != nil {
		logger.Error(util.FindMetricsGroupError, "FindAllActions", db.Error, metricsGroups)
		return []MetricsGroup{}, db.Error
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

func (main Main) ResumeByCircle(circleId string) ([]MetricGroupResume, error) {
	var db *gorm.DB
	var metricsGroups []MetricsGroup
	var metricsGroupsResume []MetricGroupResume

	if circleId == "" {
		db = main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	} else {
		circleIdParsed, _ := uuid.Parse(circleId)
		db = main.db.Set("gorm:auto_preload", true).Where("circle_id=?", circleIdParsed).Find(&metricsGroups)
	}

	if db.Error != nil {
		logger.Error(util.ResumeByCircleError, "ResumeByCircle", db.Error, metricsGroups)
		return []MetricGroupResume{}, db.Error
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

func (main Main) Save(metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Create(&metricsGroup)
	if db.Error != nil {
		logger.Error(util.SaveMetricsGroupError, "SaveAction", db.Error, metricsGroup)
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) FindById(id string) (MetricsGroup, error) {
	metricsGroup := MetricsGroup{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		logger.Error(util.FindMetricsGroupError, "FindActionById", db.Error, "Id = "+id)
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) ListAllByCircle(circleId string) ([]MetricsGroupRepresentation, error) {
	var metricsGroups []MetricsGroupRepresentation
	db := main.db.Table("metrics_groups").Select([]string{"name", "id"}).Where("circle_id = ? and deleted_at is null", circleId).Find(&metricsGroups)
	if db.Error != nil {
		logger.Error(util.FindMetricsGroupError, "ListAllByCircle", db.Error, "CircleId= "+circleId)
		return []MetricsGroupRepresentation{}, db.Error
	}

	for idx, _ := range metricsGroups {
		actionResume, err := main.groupActionsMain.ListGroupActionExecutionResumeByGroup(metricsGroups[idx].ID.String())
		if err != nil {
			logger.Error(util.FindMetricsGroupError, "ListAllByCircle", db.Error, "CircleId= "+circleId)
			return []MetricsGroupRepresentation{}, err
		}
		metrics, err := main.metricMain.FindAllByGroup(metricsGroups[idx].ID.String())
		if err != nil {
			logger.Error(util.FindMetricsGroupError, "ListAllByCircle", db.Error, "CircleId= "+circleId)
			return []MetricsGroupRepresentation{}, err
		}
		metricsGroups[idx].Actions = actionResume
		metricsGroups[idx].Metrics = metrics
	}

	return metricsGroups, nil
}

func (main Main) Update(id string, metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update(&metricsGroup)
	if db.Error != nil {
		logger.Error(util.UpdateMetricsGroupError, "UpdateAction", db.Error, metricsGroup)
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) UpdateName(id string, metricsGroup MetricsGroup) (MetricsGroup, error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update("name", metricsGroup.Name)
	if db.Error != nil {
		logger.Error(util.UpdateNameMetricsGroupError, "UpdateName", db.Error, fmt.Sprintf("metricGroup: id = %s, name = %s", id, metricsGroup.Name))
		return MetricsGroup{}, db.Error
	}
	return metricsGroup, nil
}

func (main Main) Remove(id string) error {
	db := main.db.Where("id = ?", id).Delete(MetricsGroup{})
	if db.Error != nil {
		logger.Error(util.RemoveMetricsGroupError, "Remove", db.Error, id)
		return db.Error
	}
	return nil
}

func (main Main) QueryByGroupID(id string, period, interval datasource.Period) ([]datasource.MetricValues, error) {
	var metricsValues []datasource.MetricValues
	metricsGroup, err := main.FindById(id)
	if err != nil {
		notFoundErr := errors.New("Not found metrics group: " + id)
		logger.Error(util.FindMetricsGroupError, "QueryByGroupID", notFoundErr, id)
		return []datasource.MetricValues{}, notFoundErr
	}

	if len(metricsGroup.Metrics) == 0 {
		return []datasource.MetricValues{}, nil
	}

	for _, metr := range metricsGroup.Metrics {

		query, err := main.metricMain.Query(metr, period, interval)
		if err != nil {
			logger.Error(util.QueryByGroupIdError, "QueryByGroupID", err, metr)
			return []datasource.MetricValues{}, err
		}

		metricsValues = append(metricsValues, datasource.MetricValues{
			ID:       metr.ID,
			Nickname: metr.Nickname,
			Values:   query,
		})
	}

	return metricsValues, nil
}

func (main Main) ResultByGroup(group MetricsGroup) ([]datasource.MetricResult, error) {
	var metricsResults []datasource.MetricResult
	for _, metr := range group.Metrics {

		result, err := main.metricMain.ResultQuery(metr)
		if err != nil {
			logger.Error(util.ResultQueryError, "ResultByGroup", err, metr)
			return nil, err
		}

		metricsResults = append(metricsResults, datasource.MetricResult{
			ID:       metr.ID,
			Nickname: metr.Nickname,
			Result:   result,
		})
	}

	return metricsResults, nil
}

func (main Main) ResultByID(id string) ([]datasource.MetricResult, error) {
	metricsGroup, err := main.FindById(id)
	if err != nil {
		notFoundErr := errors.New("Not found metrics group: " + id)
		logger.Error(util.FindMetricsGroupError, "ResultByID", notFoundErr, id)
		return []datasource.MetricResult{}, notFoundErr
	}

	return main.ResultByGroup(metricsGroup)
}
