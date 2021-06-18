package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func MetricsGroupActionDomainToModel(metricsGroupAction domain.MetricsGroupAction) models.MetricsGroupAction {
	return models.MetricsGroupAction{
		BaseModel:            metricsGroupAction.BaseModel,
		MetricsGroupID:       metricsGroupAction.MetricsGroupID,
		ActionID:             metricsGroupAction.ActionID,
		Nickname:             metricsGroupAction.Nickname,
		ExecutionParameters:  metricsGroupAction.ExecutionParameters,
		ActionsConfiguration: ActionsConfigurationDomainToModel(metricsGroupAction.ActionsConfiguration),
	}
}

func ActionsConfigurationDomainToModel(actionConfiguration domain.ActionsConfiguration) models.ActionsConfiguration {
	return models.ActionsConfiguration{
		BaseModel:            actionConfiguration.BaseModel,
		MetricsGroupActionID: actionConfiguration.MetricsGroupActionID,
		Repeatable:           actionConfiguration.Repeatable,
		NumberOfCycles:       actionConfiguration.NumberOfCycles,
	}
}

func MetricsGroupActionModelToDomain(metricsGroupAction models.MetricsGroupAction) domain.MetricsGroupAction {
	return domain.MetricsGroupAction{
		BaseModel:            metricsGroupAction.BaseModel,
		MetricsGroupID:       metricsGroupAction.MetricsGroupID,
		ActionID:             metricsGroupAction.ActionID,
		Nickname:             metricsGroupAction.Nickname,
		ExecutionParameters:  metricsGroupAction.ExecutionParameters,
		ActionsConfiguration: ActionsConfigurationModelToDomain(metricsGroupAction.ActionsConfiguration),
	}
}

func ActionsConfigurationModelToDomain(actionConfiguration models.ActionsConfiguration) domain.ActionsConfiguration {
	return domain.ActionsConfiguration{
		BaseModel:            actionConfiguration.BaseModel,
		MetricsGroupActionID: actionConfiguration.MetricsGroupActionID,
		Repeatable:           actionConfiguration.Repeatable,
		NumberOfCycles:       actionConfiguration.NumberOfCycles,
	}
}

func GroupActionExecutionStatusResumeModelToDomain(model models.GroupActionExecutionStatusResume) domain.GroupActionExecutionStatusResume {
	return domain.GroupActionExecutionStatusResume{
		Id:         model.Id,
		Nickname:   model.Nickname,
		ActionType: model.ActionType,
		Status:     model.Status,
		StartedAt:  model.StartedAt,
	}
}

func GroupActionExecutionStatusResumeDomainToModel(model domain.GroupActionExecutionStatusResume) models.GroupActionExecutionStatusResume {
	return models.GroupActionExecutionStatusResume{
		Id:         model.Id,
		Nickname:   model.Nickname,
		ActionType: model.ActionType,
		Status:     model.Status,
		StartedAt:  model.StartedAt,
	}
}

func MetricsGroupActionDomainToModels(metricsGroupActions []domain.MetricsGroupAction) []models.MetricsGroupAction {
	var metricsGroupActionList []models.MetricsGroupAction
	for _, result := range metricsGroupActions {
		metricsGroupActionList = append(metricsGroupActionList, MetricsGroupActionDomainToModel(result))
	}
	return metricsGroupActionList
}

func MetricsGroupActionModelToDomains(metricsGroupActions []models.MetricsGroupAction) []domain.MetricsGroupAction {
	var metricsGroupActionList []domain.MetricsGroupAction
	for _, result := range metricsGroupActions {
		metricsGroupActionList = append(metricsGroupActionList, MetricsGroupActionModelToDomain(result))
	}
	return metricsGroupActionList
}

func GroupActionExecutionStatusResumeModelToDomains(resumeModels []models.GroupActionExecutionStatusResume) []domain.GroupActionExecutionStatusResume {
	var resumeList []domain.GroupActionExecutionStatusResume
	for _, result := range resumeModels {
		resumeList = append(resumeList, GroupActionExecutionStatusResumeModelToDomain(result))
	}
	return resumeList
}

func GroupActionExecutionStatusResumeDomainToModels(resumeDomains []domain.GroupActionExecutionStatusResume) []models.GroupActionExecutionStatusResume {
	var resumeList []models.GroupActionExecutionStatusResume
	for _, result := range resumeDomains {
		resumeList = append(resumeList, GroupActionExecutionStatusResumeDomainToModel(result))
	}
	return resumeList
}
