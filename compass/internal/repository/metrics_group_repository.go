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
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"regexp"
	"sort"
	"strconv"
)

type MetricsGroupRepository interface {
	PeriodValidate(currentPeriod string) (datasourcePKG.Period, error)
	FindAll() ([]domain.MetricsGroup, error)
	FindAllByWorkspaceId(workspaceId uuid.UUID) ([]domain.MetricsGroup, error)
	ResumeByCircle(circleId uuid.UUID) ([]domain.MetricGroupResume, error)
	Save(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
	FindById(id uuid.UUID) (domain.MetricsGroup, error)
	Update(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
	UpdateName(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error)
	Remove(id uuid.UUID) error
	QueryByGroupID(id uuid.UUID, period, interval datasourcePKG.Period) ([]domain.MetricValues, error)
	ResultByGroup(group domain.MetricsGroup) ([]domain.MetricResult, error)
	ResultByID(id uuid.UUID) ([]domain.MetricResult, error)
	ListAllByCircle(circleId uuid.UUID) ([]domain.MetricsGroupRepresentation, error)
}

type metricsGroupRepository struct {
	db               *gorm.DB
	metricMain       MetricRepository
	groupActionsMain MetricsGroupActionRepository
}

func NewMetricsGroupRepository(db *gorm.DB, metricMain MetricRepository, groupActionsMain MetricsGroupActionRepository) MetricsGroupRepository {
	return metricsGroupRepository{
		db:               db,
		metricMain:       metricMain,
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

func (main metricsGroupRepository) PeriodValidate(currentPeriod string) (datasourcePKG.Period, error) {
	reg, err := regexp.Compile("[0-9]")
	if err != nil {
		return datasourcePKG.Period{}, logging.NewError("Invalid period", err, nil, "MetricsGroupRepository.PeriodValidate.Compile")
	}

	if currentPeriod != "" && !reg.Match([]byte(currentPeriod)) {
		return datasourcePKG.Period{}, logging.NewError("Invalid period", err, nil, "MetricsGroupRepository.PeriodValidate.RegexMatch")
	}

	unit := reg.ReplaceAllString(currentPeriod, "")
	_, ok := Periods[unit]
	if !ok && currentPeriod != "" {
		return datasourcePKG.Period{}, logging.NewError("Invalid period", err, nil, "MetricsGroupRepository.PeriodValidate.ReplaceAllString")
	}

	valueReg := regexp.MustCompile("[A-Za-z]").Split(currentPeriod, -1)

	value, err := strconv.Atoi(valueReg[0])
	if err != nil {
		return datasourcePKG.Period{}, logging.NewError("Invalid period", err, nil, "MetricsGroupRepository.PeriodValidate.Atoi")
	}

	return datasourcePKG.Period{
		Value: int64(value),
		Unit:  unit,
	}, nil
}

func (main metricsGroupRepository) FindAll() ([]domain.MetricsGroup, error) {
	var metricsGroups []models.MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Find(&metricsGroups)
	if db.Error != nil {
		return []domain.MetricsGroup{}, logging.NewError("Find All error", db.Error, nil, "MetricsGroupRepository.FindAll.Find")
	}
	return mapper.MetricsGroupModelToDomains(metricsGroups), nil
}

func (main metricsGroupRepository) FindAllByWorkspaceId(workspaceId uuid.UUID) ([]domain.MetricsGroup, error) {
	var metricsGroups []models.MetricsGroup
	db := main.db.Set("gorm:auto_preload", true).Where("workspace_id=?", workspaceId).Find(&metricsGroups)
	if db.Error != nil {
		return []domain.MetricsGroup{}, logging.NewError("Find All error", db.Error, nil, "MetricsGroupRepository.FindAllByWorkspaceId.Find")
	}
	return mapper.MetricsGroupModelToDomains(metricsGroups), nil
}

func (main metricsGroupRepository) isMetricError(metrics []models.Metric) bool {
	for _, currentMetric := range metrics {
		if currentMetric.MetricExecution.Status == MetricError {
			return true
		}
	}

	return false
}

func (main metricsGroupRepository) getResumeStatusByGroup(reachedMetrics, configuredMetrics int, metrics []models.Metric) string {
	if main.isMetricError(metrics) {
		return MetricError
	}

	if reachedMetrics == configuredMetrics && reachedMetrics > 0 {
		return MetricReached
	}

	return MetricActive
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
		configuredMetrics, reachedMetrics, allMetrics := main.metricMain.CountMetrics(mapper.MetricModelToDomains(group.Metrics))
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

func (main metricsGroupRepository) sortResumeMetrics(metricsGroupResume []models.MetricGroupResume) {

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

func (main metricsGroupRepository) FindById(id uuid.UUID) (domain.MetricsGroup, error) {
	metricsGroup := models.MetricsGroup{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroup)
	if db.Error != nil {
		return domain.MetricsGroup{}, logging.NewError("Find Metric Group By Id error", db.Error, nil, "MetricsGroupRepository.FindById.First")
	}

	return mapper.MetricsGroupModelToDomain(metricsGroup), nil
}

func (main metricsGroupRepository) ListAllByCircle(circleId uuid.UUID) ([]domain.MetricsGroupRepresentation, error) {
	var metricsGroups []models.MetricsGroupRepresentation
	db := main.db.Table("metrics_groups").Select([]string{"name", "id"}).Where("circle_id = ? and deleted_at is null", circleId).Find(&metricsGroups)
	if db.Error != nil {
		return []domain.MetricsGroupRepresentation{}, logging.NewError("List all metrics error", db.Error, nil, "MetricsGroupRepository.ListAllByCircle.First")
	}

	for idx := range metricsGroups {

		actionResume, err := main.groupActionsMain.ListGroupActionExecutionResumeByGroup(metricsGroups[idx].ID)
		if err != nil {
			return []domain.MetricsGroupRepresentation{}, logging.WithOperation(err, "MetricsGroupRepository.ListAllByCircle.ListGroupActionExecutionResumeByGroup")
		}

		metrics, err := main.metricMain.FindAllByGroup(metricsGroups[idx].ID)
		if err != nil {
			return []domain.MetricsGroupRepresentation{}, logging.WithOperation(err, "MetricsGroupRepository.ListAllByCircle.FindAllByGroup")
		}

		metricsGroups[idx].Actions = mapper.GroupActionExecutionStatusResumeDomainToModels(actionResume)
		metricsGroups[idx].Metrics = mapper.MetricDomainToModels(metrics)
	}

	return mapper.MetricsGroupRepresentationModelToDomains(metricsGroups), nil
}

func (main metricsGroupRepository) Update(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	modelMetricsGroup := mapper.MetricsGroupDomainToModel(metricsGroup)
	db := main.db.Table("metrics_groups").Where("id = ?", id).Updates(&modelMetricsGroup)
	if db.Error != nil {
		return domain.MetricsGroup{}, logging.NewError("Update Metric Group", db.Error, nil, "MetricsGroupRepository.Update.Updates")
	}
	return mapper.MetricsGroupModelToDomain(modelMetricsGroup), nil
}

func (main metricsGroupRepository) UpdateName(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	db := main.db.Table("metrics_groups").Where("id = ?", id).Update("name", metricsGroup.Name)
	if db.Error != nil {
		return domain.MetricsGroup{}, logging.NewError("Update Name Metric Group", db.Error, nil, "MetricsGroupRepository.UpdateName.Update")
	}
	return metricsGroup, nil
}

func (main metricsGroupRepository) Remove(id uuid.UUID) error {
	db := main.db.Where("id = ?", id).Delete(models.MetricsGroup{})
	if db.Error != nil {
		return logging.NewError("Delete Metric Group", db.Error, nil, "MetricsGroupRepository.Remove.Delete")
	}
	return nil
}

func (main metricsGroupRepository) QueryByGroupID(id uuid.UUID, period, interval datasourcePKG.Period) ([]domain.MetricValues, error) {
	var metricsValues []datasourcePKG.MetricValues
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return []domain.MetricValues{}, logging.NewError("Query error", err, nil, "MetricsGroupRepository.QueryByGroupID.FindById")
	}

	if len(metricsGroup.Metrics) == 0 {
		return []domain.MetricValues{}, nil
	}

	for _, metr := range metricsGroup.Metrics {

		query, err := main.metricMain.Query(metr, period, interval)
		if err != nil {
			return []domain.MetricValues{}, logging.NewError("Query error", err, nil, "MetricsGroupRepository.QueryByGroupID.Query")
		}

		metricsValues = append(metricsValues, datasourcePKG.MetricValues{
			ID:       metr.ID,
			Nickname: metr.Nickname,
			Values:   query,
		})
	}

	return mapper.MetricValuesToDomains(metricsValues), nil
}

func (main metricsGroupRepository) ResultByGroup(group domain.MetricsGroup) ([]domain.MetricResult, error) {
	var metricsResults []datasourcePKG.MetricResult
	for _, metr := range group.Metrics {

		result, err := main.metricMain.ResultQuery(metr)
		if err != nil {
			return nil, logging.NewError("Result error", err, nil, "MetricsGroupRepository.ResultByGroup.ResultQuery")
		}

		metricsResults = append(metricsResults, datasourcePKG.MetricResult{
			ID:       metr.ID,
			Nickname: metr.Nickname,
			Result:   result,
		})
	}

	return mapper.MetricResultsToDomains(metricsResults), nil
}

func (main metricsGroupRepository) ResultByID(id uuid.UUID) ([]domain.MetricResult, error) {
	metricsGroup, err := main.FindById(id)
	if err != nil {
		return []domain.MetricResult{}, logging.NewError("Result error", err, nil, "MetricsGroupRepository.ResultByID.FindById")
	}

	return main.ResultByGroup(metricsGroup)
}
