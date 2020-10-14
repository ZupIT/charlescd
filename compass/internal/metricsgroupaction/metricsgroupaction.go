package metricsgroupaction

import (
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"io"
	"strings"
	"time"
)

type MetricsGroupActions struct {
	util.BaseModel
	MetricsGroupID      uuid.UUID             `json:"metricsGroupId"`
	ActionID            uuid.UUID             `json:"actionId"`
	Nickname            string                `json:"nickname"`
	ExecutionParameters json.RawMessage       `json:"executionParameters"`
	Configuration       ActionsConfigurations `json:"configuration"`
	DeletedAt           *time.Time            `json:"-"`
}

type ActionsConfigurations struct {
	util.BaseModel
	MetricActionId uuid.UUID `json:"-"`
	Repeatable     bool      `json:"repeatable"`
	NumberOfCycles int16     `json:"numberOfCycles"`
}

type GroupActionExecutionStatusResume struct {
	Id         string     `json:"id"`
	Nickname   string     `json:"nickname"`
	ActionType string     `json:"actionType"`
	Status     string     `json:"status"`
	StartedAt  *time.Time `json:"triggeredAt"`
}

const groupActionQuery = `
				SELECT 	mga.id									AS id,
						mga.nickname 							AS nickname,
						a.nickname          					AS action_type,
       					coalesce (ae.status, 'NOT_EXECUTED')	AS status,
       					ae.started_at 							AS execution
				FROM metrics_group_actions mga
         			INNER JOIN actions a 			ON mga.action_id = a.id	
					LEFT JOIN actions_executions ae ON mga.id = ae.group_action_id
					WHERE mga.metrics_group_id = ? 
					ORDER BY execution DESC`

func (main Main) ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupActions, error) {
	var mgAct MetricsGroupActions

	err := json.NewDecoder(metricsGroupAction).Decode(&mgAct)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, mgAct)
		return MetricsGroupActions{}, err
	}

	mgAct.Nickname = strings.TrimSpace(mgAct.Nickname)

	return mgAct, nil
}

func (main Main) ValidateGroupAction(metricsGroupAction MetricsGroupActions, workspaceID string) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)
	needConfigValidation := true

	if metricsGroupAction.ActionID == uuid.Nil {
		ers = append(ers, util.ErrorUtil{
			Field: "action",
			Error: errors.New("action id is required").Error(),
		})
	}

	if metricsGroupAction.MetricsGroupID == uuid.Nil {
		ers = append(ers, util.ErrorUtil{
			Field: "metricGroup",
			Error: errors.New("metric group id is required").Error(),
		})
	}

	if strings.TrimSpace(metricsGroupAction.Nickname) == "" {
		ers = append(ers, util.ErrorUtil{
			Field: "nickname",
			Error: errors.New("action nickname is required").Error(),
		})
	} else if len(metricsGroupAction.Nickname) > 100 {
		ers = append(ers, util.ErrorUtil{
			Field: "nickname",
			Error: errors.New("nickname is limited to 100 characters maximum").Error(),
		})
	}

	if metricsGroupAction.ExecutionParameters == nil || len(metricsGroupAction.ExecutionParameters) == 0 {
		needConfigValidation = false
		ers = append(ers, util.ErrorUtil{
			Field: "executionParameters",
			Error: errors.New("execution parameters is required").Error(),
		})
	}

	act, err := main.actionRepo.FindActionByIdAndWorkspace(metricsGroupAction.ActionID.String(), workspaceID)
	if err != nil || act.Type == "" {
		needConfigValidation = false
		logger.Error("error finding action", "ValidateGroupAction", err, metricsGroupAction.ActionID.String())
		ers = append(ers, util.ErrorUtil{
			Field: "actionId",
			Error: errors.New("action is invalid").Error(),
		})
	}

	ers = append(ers, main.validateJobConfiguration(metricsGroupAction.Configuration)...)

	if needConfigValidation {
		ers = append(ers, main.validateExecutionConfig(act.Type, metricsGroupAction.ExecutionParameters)...)
	}

	return ers
}

func (main Main) validateJobConfiguration(configuration ActionsConfigurations) []util.ErrorUtil {
	errs := make([]util.ErrorUtil, 0)

	if configuration.NumberOfCycles < 0 {
		errs = append(errs, util.ErrorUtil{Field: "configuration.NumberOfCycles", Error: "the number of cycle needs an positive integer"})
	}

	if configuration.Repeatable == false && configuration.NumberOfCycles == 0 {
		errs = append(errs, util.ErrorUtil{Field: "configuration.Repeatable", Error: "a not repeatable action needs a defined number of cycles"})
	}

	return errs
}

func (main Main) validateExecutionConfig(actionType string, executionConfiguration json.RawMessage) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	plugin, err := main.pluginRepo.GetPluginBySrc(fmt.Sprintf("action/%s/%s", actionType, actionType))
	if err != nil {
		logger.Error("error finding plugin", "ValidateExecutionConfig", err, actionType)
		return []util.ErrorUtil{{Field: "actionId", Error: errors.New("action is invalid").Error()}}
	}

	pluginErrs, err := plugin.Lookup("ValidateExecutionConfiguration")
	if err != nil {
		logger.Error("error looking up for plugin", "ValidateExecutionConfig", err, fmt.Sprintf("%+v", plugin))
		return []util.ErrorUtil{{Field: "actionId", Error: errors.New("action is invalid").Error()}}
	}

	configErs := pluginErrs.(func(executionConfig []byte) []error)(executionConfiguration)
	if len(configErs) > 0 {
		for _, err := range configErs {
			ers = append(ers, util.ErrorUtil{Field: "executionParameters", Error: err.Error()})
		}
	}

	return ers
}

func (main Main) SaveGroupAction(metricsGroupAction MetricsGroupActions) (MetricsGroupActions, error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "SaveAction", db.Error, metricsGroupAction)
		return MetricsGroupActions{}, db.Error
	}

	return metricsGroupAction, nil
}

func (main Main) UpdateGroupAction(id string, metricsGroupAction MetricsGroupActions) (MetricsGroupActions, error) {
	parsedId, err := uuid.Parse(id)
	if err != nil {
		logger.Error(util.UpdateActionError, "UpdateAction", err, fmt.Sprintf("Id: %s", id))
		return MetricsGroupActions{}, err
	}

	metricsGroupAction.BaseModel.ID = parsedId
	db := main.db.Save(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.UpdateActionError, "UpdateAction", db.Error, metricsGroupAction)
		return MetricsGroupActions{}, db.Error
	}

	return metricsGroupAction, nil
}

func (main Main) FindGroupActionById(id string) (MetricsGroupActions, error) {
	metricsGroupAction := MetricsGroupActions{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindActionById", db.Error, "Id = "+id)
		return MetricsGroupActions{}, db.Error
	}

	return metricsGroupAction, nil
}

func (main Main) DeleteGroupAction(id string) error {
	db := main.db.Model(&MetricsGroupActions{}).Where("id = ?", id).Delete(&MetricsGroupActions{})
	if db.Error != nil {
		logger.Error(util.DeleteActionError, "DeleteAction", db.Error, "Id = "+id)
		return db.Error
	}

	return nil
}

func (main Main) ListGroupActionExecutionResumeByGroup(groupID string) ([]GroupActionExecutionStatusResume, error) {
	var executions []GroupActionExecutionStatusResume
	result := main.db.Raw(groupActionQuery, groupID).Find(&executions)
	if result.Error != nil {
		logger.Error(util.ListGroupActionExecutionStatusError, "ListGroupActionExecutionResumeByGroup", result.Error, groupID)
		return nil, result.Error
	}

	return executions, nil
}

func (main Main) ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupActions) bool {
	count, err := main.getNumberOfActionExecutions(metricsGroupAction.ID)
	if err != nil {
		logger.Error(util.ActionExecutionValidateError, "ValidateActionCanBeExecuted", err, fmt.Sprintf("%+v", metricsGroupAction))
		return false
	}

	return metricsGroupAction.Configuration.Repeatable || int64(metricsGroupAction.Configuration.NumberOfCycles) > count
}
