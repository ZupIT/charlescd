package representation

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type ActionRequest struct {
	Nickname      string          `json:"nickname" validate:"notblank, max=64"`
	Type          string          `json:"type" validate:"notblank, max=100"`
	Description   string          `json:"description" validate:"notblank, max=64"`
	UseDefault    bool            `json:"useDefaultConfiguration" gorm:"-"`
	Configuration json.RawMessage `json:"configuration" validate:"required, json"`
}

type ActionResponse struct {
	util.BaseModel
	WorkspaceId   uuid.UUID       `json:"workspaceId"`
	Nickname      string          `json:"nickname"`
	Type          string          `json:"type"`
	Description   string          `json:"description"`
	UseDefault    bool            `json:"useDefaultConfiguration" gorm:"-"`
	Configuration json.RawMessage `json:"configuration"`
	DeletedAt     *time.Time      `json:"-"`
}

func (request ActionRequest) RequestToDomain(workspaceId uuid.UUID) domain.Action {
	return domain.Action{
		WorkspaceId:   workspaceId,
		Nickname:      request.Nickname,
		Type:          request.Type,
		Description:   request.Description,
		UseDefault:    request.UseDefault,
		Configuration: request.Configuration,
	}
}

func ActionDomainToResponse(actionDomain domain.Action) ActionResponse {
	return ActionResponse{
		BaseModel:     actionDomain.BaseModel,
		WorkspaceId:   actionDomain.WorkspaceId,
		Nickname:      actionDomain.Nickname,
		Type:          actionDomain.Type,
		Description:   actionDomain.Description,
		UseDefault:    actionDomain.UseDefault,
		Configuration: actionDomain.Configuration,
	}
}

func ActionDomainToResponses(actionDomain []domain.Action) []ActionResponse {
	var actionResponse []ActionResponse
	for _, action := range actionDomain {
		actionResponse = append(actionResponse, ActionDomainToResponse(action))
	}
	return actionResponse
}
