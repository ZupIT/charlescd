package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"strings"
)

type MetricsGroupResponse struct {
	util.BaseModel
	Name     string                                  `json:"name"`
	Metrics  []metric.Metric                         `json:"metrics"`
	CircleID uuid.UUID                               `json:"circleId"`
	Actions  []metricsgroupaction.MetricsGroupAction `json:"actions"`
}

type MetricsGroupRequest struct {
	Name     string                                  `json:"name" validate:"notblank, max=64"`
	Metrics  []metric.Metric                         `json:"metrics"`
	CircleID uuid.UUID                               `json:"circleId" validate:"notblank, uuid"`
	Actions  []metricsgroupaction.MetricsGroupAction `json:"actions"`
}

type MetricsGroupUpdateRequest struct {
	Name     string                                  `json:"name"`
	Metrics  []metric.Metric                         `json:"metrics"`
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
		Metrics:   metricsGroup.Metrics,
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

func MetricsGroupToResponses(metricsGroups []domain.MetricsGroup) []MetricsGroupResponse {
	var metricsGroupResponse []MetricsGroupResponse
	for _, datasource := range metricsGroups {
		metricsGroupResponse = append(metricsGroupResponse, MetricsGroupToResponse(datasource))
	}
	return metricsGroupResponse
}

func MetricGroupResumeToResponses(metricsGroupResumes []domain.MetricGroupResume) []MetricGroupResumeResponse {
	var metricsGroupResponse []MetricGroupResumeResponse
	for _, datasource := range metricsGroupResumes {
		metricsGroupResponse = append(metricsGroupResponse, MetricGroupResumeToResponse(datasource))
	}
	return metricsGroupResponse
}
