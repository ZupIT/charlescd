package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func ActionModelToDomain(action models.Action) domain.Action {
	return domain.Action{
		BaseModel:     action.BaseModel,
		WorkspaceId:   action.WorkspaceId,
		Nickname:      action.Nickname,
		Type:          action.Type,
		Description:   action.Description,
		UseDefault:    action.UseDefault,
		Configuration: action.Configuration,
	}
}

func ActionModelToDomains(action []models.Action) []domain.Action {
	actions := make([]domain.Action, 0)
	for _, ds := range action {
		actions = append(actions, ActionModelToDomain(ds))
	}
	return actions
}
