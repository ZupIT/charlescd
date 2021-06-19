package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func ActionExecutionModelToDomain(actionExecution models.ActionsExecutions) domain.ActionsExecutions {
	return domain.ActionsExecutions{
		BaseModel:     actionExecution.BaseModel,
		GroupActionId: actionExecution.GroupActionId,
		ExecutionLog:  actionExecution.ExecutionLog,
		Status:        actionExecution.Status,
		StartedAt:     actionExecution.StartedAt,
		FinishedAt:    actionExecution.FinishedAt,
	}
}
