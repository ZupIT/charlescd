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

package repository

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"regexp"
	"sort"
	"strconv"
)

type MetricsGroupRepository interface {
	PeriodValidate(currentPeriod string) (datasourcePKG.Period, errors.Error)
	FindAll() ([]MetricsGroup, errors.Error)
	FindAllByWorkspaceId(workspaceId uuid.UUID) ([]domain.MetricsGroup, error)
	ResumeByCircle(circleId uuid.UUID) ([]domain.MetricGroupResume, error)
	Save(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
	FindById(id uuid.UUID) (domain.MetricsGroup, error)
	Update(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error)
	UpdateName(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error)
	Remove(id string) errors.Error
	QueryByGroupID(id string, period, interval datasourcePKG.Period) ([]datasourcePKG.MetricValues, errors.Error)
	ResultByGroup(group MetricsGroup) ([]datasourcePKG.MetricResult, errors.Error)
	ResultByID(id string) ([]datasourcePKG.MetricResult, errors.Error)
	ListAllByCircle(circleId string) ([]models.MetricsGroupRepresentation, errors.Error)
}

type metricsGroupRepository struct {
	db               *gorm.DB
	metricMain       metric.UseCases
	datasourceMain   DatasourceRepository
	pluginMain       PluginRepository
	groupActionsMain metricsgroupaction.UseCases
}

func NewMetricsGroupRepository(
	db *gorm.DB,
	metricMain metric.UseCases,
	datasourceMain DatasourceRepository,
	pluginMain PluginRepository,
	groupActionsMain metricsgroupaction.UseCases,
) MetricsGroupRepository {
	return metricsGroupRepository{
		db:               db,
		metricMain:       metricMain,
		datasourceMain:   datasourceMain,
		pluginMain:       pluginMain,
		groupActionsMain: groupActionsMain,
	}
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

func (main metricsGroupRepository) PeriodValidate(currentPeriod string) (datasourcePKG.Period, errors.Error) {
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

func (main metricsGroupRepository) FindAll() ([]MetricsGroup, errors.Error) {
	var metricsGroups []MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	if db.Error != nil {
		return []MetricsGroup{}, errors.NewError("FindAll error", db.Error.Error()).
			WithOperations("FindAll.DBFind")
	}
	return metricsGroups, nil
}

func (main metricsGroupRepository) FindAllByWorkspaceId(workspaceId uuid.UUID) ([]domain.MetricsGroup, error) {
	var metricsGroups []models.MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Where("workspace_id=?", workspaceId).Find(&metricsGroups)
	if db.Error != nil {
		return []domain.MetricsGroup{}, logging.NewError("Find All error", db.Error, nil, "MetricsGroupRepository.FindAllByWorkspaceId.Find")
	}
	return mapper.MetricsGroupModelToDomains(metricsGroups), nil
}

func (main metricsGroupRepository) isMetricError(metrics []metric.Metric) bool {
	for _, currentMetric := range metrics {
		if currentMetric.MetricExecution.Status == metric.MetricError {
			return true
		}
	}

	return false
}

func (main metricsGroupRepository) getResumeStatusByGroup(reachedMetrics, configuredMetrics int, metrics []metric.Metric) string {
	if main.isMetricError(metrics) {
		return metric.MetricError
	}

	if reachedMetrics == configuredMetrics && reachedMetrics > 0 {
		return metric.MetricReached
	}

	return metric.MetricActive
}

func (main metricsGroupRepository) ResumeByCircle(circleId uuid.UUID) ([]domain.MetricGroupResume, error) {
	var db *gorm.DB
	var metricsGroups []models.MetricsGroup
	var metricsGroupsResume []models.MetricGroupResume

	if circleId == uuid.Nil {
		db = main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	} else {
		db = main.db.Set("gorm:auto_preload", true).Where("circle_id=?", circleId).Find(&metricsGroups)
	}

	if db.Error != nil {
		return []domain.MetricGroupResume{}, logging.NewError("ResumeByCircle error", db.Error, nil, "MetricsGroupRepository.ResumeByCircle.Find")
	}

	for _, group := range metricsGroups {
		configuredMetrics, reachedMetrics, allMetrics := main.metricMain.CountMetrics(group.Metrics)
		metricsGroupsResume = append(metricsGroupsResume, models.MetricGroupResume{
			BaseModel:         group.BaseModel,
			Name:              group.Name,
			Thresholds:        configuredMetrics,
			ThresholdsReached: reachedMetrics,
			Metrics:           allMetrics,
			Status:            main.getResumeStatusByGroup(reachedMetrics, configuredMetrics, group.Metrics),
		})
	}

	main.sortResumeMetrics(metricsGroupsResume)

	return mapper.MetricGroupResumeModelToDomains(metricsGroupsResume), nil
}

func (main metricsGroupRepository) sortResumeMetrics(metricsGroupResume []MetricGroupResume) {

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

func (main metricsGroupRepository) Save(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	modelMetricsGroup := mapper.MetricsGroupDomainToModel(metricsGroup)

	db := main.db.Create(&modelMetricsGroup)
	if db.Error != nil {
		return domain.MetricsGroup{}, logging.NewError("Save error", db.Error, nil, "MetricsGroupRepository.Save.Create")
	}
	return mapper.MetricsGroupModelToDomain(modelMetricsGroup), nil
}

func (main metricsGroupRepository) FindById(id string) (domain.MetricsGroup, error) {
	metricsGroup := models.MetricsGroup{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		return domain.MetricsGroup{}, logging.NewError("Find Metric Group By Id error", db.Error, nil, "MetricsGroupRepository.FindById.First")
	}

	return mapper.MetricsGroupModelToDomain(metricsGroup), nil
}

func (main metricsGroupRepository) ListAllByCircle(circleId string) ([]models.MetricsGroupRepresentation, errors.Error) {
	var metricsGroups []models.MetricsGroupRepresentation
	db := main.db.Table("metrics_groups").Select([]string{"name", "id"}).Where("circle_id = ? and deleted_at is null", circleId).Find(&metricsGroups)
	if db.Error != nil {
		return []models.MetricsGroupRepresentation{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("ListAllByCircle.Find")
	}

	for idx := range metricsGroups {
		actionResume, err := main.groupActionsMain.ListGroupActionExecutionResumeByGroup(metricsGroups[idx].ID.String())
		if err != nil {
			return []models.MetricsGroupRepresentation{}, err.WithOperations("ListAllByCircle.ListGroupActionExecutionResumeByGroup")
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

func (main metricsGroupRepository) Update(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Updates(&metricsGroup)
	if db.Error != nil {
		return MetricsGroup{}, errors.NewError("Update error", db.Error.Error()).
			WithOperations("Update.Update")
	}
	return metricsGroup, nil
}

func (main metricsGroupRepository) UpdateName(id string, metricsGroup MetricsGroup) (MetricsGroup, errors.Error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update("name", metricsGroup.Name)
	if db.Error != nil {
		return MetricsGroup{}, errors.NewError("UpdateName error", db.Error.Error()).
			WithOperations("UpdateName.Update")
	}
	return metricsGroup, nil
}

func (main metricsGroupRepository) Remove(id string) errors.Error {
	db := main.db.Where("id = ?", id).Delete(MetricsGroup{})
	if db.Error != nil {
		return errors.NewError("Remove error", db.Error.Error()).
			WithOperations("Remove.Delete")
	}
	return nil
}

func (main metricsGroupRepository) QueryByGroupID(id string, period, interval datasource.Period) ([]datasource.MetricValues, errors.Error) {
	var metricsValues []datasource.MetricValues
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return []datasource.MetricValues{}, errors.NewError("Not found", "Not found metrics group: "+id).
			WithOperations("QueryByGroupID.FindById")
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

func (main metricsGroupRepository) ResultByGroup(group MetricsGroup) ([]datasource.MetricResult, errors.Error) {
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

func (main metricsGroupRepository) ResultByID(id string) ([]datasource.MetricResult, errors.Error) {
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return []datasource.MetricResult{}, errors.NewError("Not found", "Not found metrics group: "+id).
			WithOperations("ResultByID.FindById")
	}

	return main.ResultByGroup(metricsGroup)
}
