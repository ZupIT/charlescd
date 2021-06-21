package representation

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
)

type MetricsGroupActionRequest struct {
	MetricsGroupID      uuid.UUID       `json:"metricsGroupId" validate:"required"`
	ActionID            uuid.UUID       `json:"actionId" validate:"required"`
	Nickname            string          `json:"nickname" validate:"notblank,max=100"`
	ExecutionParameters json.RawMessage `json:"executionParameters" validate:"required"`
}

type MetricsGroupActionResponse struct {
	util.BaseModel
	MetricsGroupID       uuid.UUID                    `json:"metricsGroupId"`
	ActionID             uuid.UUID                    `json:"actionId"`
	Nickname             string                       `json:"nickname"`
	ExecutionParameters  json.RawMessage              `json:"executionParameters"`
	ActionsConfiguration ActionsConfigurationResponse `json:"configuration"`
}

type ActionsConfigurationResponse struct {
	util.BaseModel
	Repeatable     bool  `json:"repeatable"`
	NumberOfCycles int16 `json:"numberOfCycles"`
}

func (mga MetricsGroupActionRequest) MetricsGroupActionRequestToDomain() domain.MetricsGroupAction {
	return domain.MetricsGroupAction{
		MetricsGroupID:       mga.MetricsGroupID,
		ActionID:             mga.ActionID,
		Nickname:             mga.Nickname,
		ExecutionParameters:  mga.ExecutionParameters,
		ActionsConfiguration: domain.ActionsConfiguration{Repeatable: false, NumberOfCycles: 1},
	}
}

func MetricsGroupActionDomainToResponse(mga domain.MetricsGroupAction) MetricsGroupActionResponse {
	return MetricsGroupActionResponse{
		BaseModel:            mga.BaseModel,
		MetricsGroupID:       mga.MetricsGroupID,
		ActionID:             mga.ActionID,
		Nickname:             mga.Nickname,
		ExecutionParameters:  mga.ExecutionParameters,
		ActionsConfiguration: ActionsConfigurationDomainToResponse(mga.ActionsConfiguration),
	}

}

func ActionsConfigurationDomainToResponse(action domain.ActionsConfiguration) ActionsConfigurationResponse {
	return ActionsConfigurationResponse{
		BaseModel:      action.BaseModel,
		Repeatable:     action.Repeatable,
		NumberOfCycles: action.NumberOfCycles,
	}
}

func MetricsGroupActionDomainToResponses(metricsGroupActions []domain.MetricsGroupAction) []MetricsGroupActionResponse {
	var metricsGroupActionList []MetricsGroupActionResponse
	for _, result := range metricsGroupActions {
		metricsGroupActionList = append(metricsGroupActionList, MetricsGroupActionDomainToResponse(result))
	}
	return metricsGroupActionList
}
