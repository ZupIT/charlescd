package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
)

type MetricsGroupResponse struct {
	util.BaseModel
	Name     string                                  `json:"name"`
	Metrics  []metric.Metric                         `json:"metrics"`
	CircleID uuid.UUID                               `json:"circleId"`
	Actions  []metricsgroupaction.MetricsGroupAction `json:"actions"`
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

func MetricsGroupToResponses(metricsGroups []domain.MetricsGroup) []MetricsGroupResponse {
	var metricsGroupResponse []MetricsGroupResponse
	for _, datasource := range metricsGroups {
		metricsGroupResponse = append(metricsGroupResponse, MetricsGroupToResponse(datasource))
	}
	return metricsGroupResponse
}
