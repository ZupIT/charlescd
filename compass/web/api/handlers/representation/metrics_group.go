package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"strings"
)

type MetricsGroupResponse struct {
	util.BaseModel
	Name     string                                  `json:"name"`
	Metrics  []MetricResponse                        `json:"metrics"`
	CircleID uuid.UUID                               `json:"circleId"`
	Actions  []metricsgroupaction.MetricsGroupAction `json:"actions"`
}

type MetricsGroupRequest struct {
	Name     string                                  `json:"name" validate:"notblank, max=64"`
	Metrics  []domain.Metric                         `json:"metrics"`
	CircleID uuid.UUID                               `json:"circleId" validate:"notblank, uuid"`
	Actions  []metricsgroupaction.MetricsGroupAction `json:"actions"`
}

type MetricsGroupUpdateRequest struct {
	Name     string                                  `json:"name"`
	Metrics  []domain.Metric                         `json:"metrics"`
	CircleID uuid.UUID                               `json:"circleId"`
	Actions  []metricsgroupaction.MetricsGroupAction `json:"actions"`
}

type MetricGroupResumeResponse struct {
	util.BaseModel
	Name              string `json:"name"`
	Thresholds        int    `json:"thresholds"`
	ThresholdsReached int    `json:"thresholdsReached"`
	Metrics           int    `json:"metricsCount"`
	Status            string `json:"status"`
}

type MetricValuesResponse struct {
	ID       uuid.UUID   `json:"id"`
	Nickname string      `json:"metric"`
	Values   interface{} `json:"result"`
}

type MetricResultResponse struct {
	ID       uuid.UUID `json:"id"`
	Nickname string    `json:"metric"`
	Result   float64   `json:"result"`
}

func (metricsGroupRequest MetricsGroupRequest) RequestToDomain(workspaceId uuid.UUID) domain.MetricsGroup {
	return domain.MetricsGroup{
		Name:        strings.TrimSpace(metricsGroupRequest.Name),
		Metrics:     metricsGroupRequest.Metrics,
		WorkspaceID: workspaceId,
		CircleID:    metricsGroupRequest.CircleID,
		Actions:     metricsGroupRequest.Actions,
	}
}

func (metricsGroupRequest MetricsGroupUpdateRequest) RequestToDomain() domain.MetricsGroup {
	return domain.MetricsGroup{
		Name:     strings.TrimSpace(metricsGroupRequest.Name),
		Metrics:  metricsGroupRequest.Metrics,
		CircleID: metricsGroupRequest.CircleID,
		Actions:  metricsGroupRequest.Actions,
	}
}

func MetricsGroupToResponse(metricsGroup domain.MetricsGroup) MetricsGroupResponse {
	return MetricsGroupResponse{
		BaseModel: metricsGroup.BaseModel,
		Name:      metricsGroup.Name,
		Metrics:   MetricDomainToResponses(metricsGroup.Metrics),
		CircleID:  metricsGroup.CircleID,
		Actions:   metricsGroup.Actions,
	}
}

func MetricGroupResumeToResponse(metricGroupResume domain.MetricGroupResume) MetricGroupResumeResponse {
	return MetricGroupResumeResponse{
		BaseModel:         metricGroupResume.BaseModel,
		Name:              metricGroupResume.Name,
		Thresholds:        metricGroupResume.Thresholds,
		ThresholdsReached: metricGroupResume.ThresholdsReached,
		Metrics:           metricGroupResume.Metrics,
		Status:            metricGroupResume.Status,
	}
}

func MetricValuesDomainToResponse(metricValues domain.MetricValues) MetricValuesResponse {
	return MetricValuesResponse{
		ID:       metricValues.ID,
		Nickname: metricValues.Nickname,
		Values:   metricValues.Values,
	}
}
func MetricResultDomainToResponse(metricResult domain.MetricResult) MetricResultResponse {
	return MetricResultResponse{
		ID:       metricResult.ID,
		Nickname: metricResult.Nickname,
		Result:   metricResult.Result,
	}
}

func MetricsGroupToResponses(metricsGroups []domain.MetricsGroup) []MetricsGroupResponse {
	var metricsGroupResponse []MetricsGroupResponse
	for _, mg := range metricsGroups {
		metricsGroupResponse = append(metricsGroupResponse, MetricsGroupToResponse(mg))
	}
	return metricsGroupResponse
}

func MetricGroupResumeToResponses(metricsGroupResumes []domain.MetricGroupResume) []MetricGroupResumeResponse {
	var metricsGroupResponse []MetricGroupResumeResponse
	for _, resume := range metricsGroupResumes {
		metricsGroupResponse = append(metricsGroupResponse, MetricGroupResumeToResponse(resume))
	}
	return metricsGroupResponse
}

func MetricValuesDomainToResponses(metricValues []domain.MetricValues) []MetricValuesResponse {
	var metricValuesList []MetricValuesResponse
	for _, mv := range metricValues {
		metricValuesList = append(metricValuesList, MetricValuesDomainToResponse(mv))
	}
	return metricValuesList
}

func MetricResultToResponses(metricResultToResponses []domain.MetricResult) []MetricResultResponse {
	var metricResultList []MetricResultResponse
	for _, result := range metricResultToResponses {
		metricResultList = append(metricResultList, MetricResultDomainToResponse(result))
	}
	return metricResultList
}
