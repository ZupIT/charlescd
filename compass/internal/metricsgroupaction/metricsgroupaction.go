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

package metricsgroupaction

import (
	"compass/internal/action"
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"io"
	"sort"
	"strings"
	"time"
)

type MetricsGroupAction struct {
	util.BaseModel
	MetricsGroupID       uuid.UUID            `json:"metricsGroupId"`
	ActionID             uuid.UUID            `json:"actionId"`
	Nickname             string               `json:"nickname"`
	ExecutionParameters  json.RawMessage      `json:"executionParameters"`
	ActionsConfiguration ActionsConfiguration `json:"configuration"`
	DeletedAt            *time.Time           `json:"-"`
}

type ActionsConfiguration struct {
	util.BaseModel
	MetricsGroupActionID uuid.UUID `json:"-"`
	Repeatable           bool      `json:"repeatable"`
	NumberOfCycles       int16     `json:"numberOfCycles"`
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
       					ae.started_at 							AS started_at
				FROM metrics_group_actions mga
         			INNER JOIN actions a 			ON mga.action_id = a.id	
					LEFT JOIN actions_executions ae ON mga.id = ae.group_action_id
					WHERE mga.metrics_group_id = ? 
					AND mga.deleted_at IS NULL`

func (main Main) ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error) {
	var mgAct MetricsGroupAction

	err := json.NewDecoder(metricsGroupAction).Decode(&mgAct)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, mgAct)
		return MetricsGroupAction{}, err
	}

	mgAct.Nickname = strings.TrimSpace(mgAct.Nickname)

	return mgAct, nil
}

func (main Main) ValidateGroupAction(metricsGroupAction MetricsGroupAction, workspaceID string) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)
	needConfigValidation := true

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

	if metricsGroupAction.MetricsGroupID == uuid.Nil {
		ers = append(ers, util.ErrorUtil{
			Field: "metricGroup",
			Error: errors.New("metric group id is required").Error(),
		})
	}

	var act action.Action
	if metricsGroupAction.ActionID == uuid.Nil {
		needConfigValidation = false
		ers = append(ers, util.ErrorUtil{
			Field: "action",
			Error: errors.New("action id is required").Error(),
		})
	} else {
		var err error
		act, err = main.actionRepo.FindActionByIdAndWorkspace(metricsGroupAction.ActionID.String(), workspaceID)
		if err != nil || act.Type == "" {
			needConfigValidation = false
			logger.Error("error finding action", "ValidateGroupAction", err, metricsGroupAction.ActionID.String())
			ers = append(ers, util.ErrorUtil{
				Field: "action",
				Error: errors.New("action is invalid").Error(),
			})
		}
	}

	ers = append(ers, main.validateJobConfiguration(metricsGroupAction.ActionsConfiguration)...)

	if needConfigValidation {
		ers = append(ers, main.validateExecutionConfig(act.Type, metricsGroupAction.ExecutionParameters)...)
	}

	return ers
}

func (main Main) validateJobConfiguration(configuration ActionsConfiguration) []util.ErrorUtil {
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
		return []util.ErrorUtil{{Field: "action", Error: errors.New("action is invalid").Error()}}
	}

	pluginErrs, err := plugin.Lookup("ValidateExecutionConfiguration")
	if err != nil {
		logger.Error("error looking up for plugin", "ValidateExecutionConfig", err, fmt.Sprintf("%+v", plugin))
		return []util.ErrorUtil{{Field: "action", Error: errors.New("action is invalid").Error()}}
	}

	configErs := pluginErrs.(func(executionConfig []byte) []error)(executionConfiguration)
	if len(configErs) > 0 {
		for _, err := range configErs {
			ers = append(ers, util.ErrorUtil{Field: "executionParameters", Error: err.Error()})
		}
	}

	return ers
}

func (main Main) SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "SaveAction", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}

	return metricsGroupAction, nil
}

func (main Main) UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error) {
	parsedId, err := uuid.Parse(id)
	if err != nil {
		logger.Error(util.UpdateActionError, "UpdateAction", err, fmt.Sprintf("Id: %s", id))
		return MetricsGroupAction{}, err
	}

	metricsGroupAction.BaseModel.ID = parsedId
	db := main.db.Save(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.UpdateActionError, "UpdateAction", db.Error, metricsGroupAction)
		return MetricsGroupAction{}, db.Error
	}

	return metricsGroupAction, nil
}

func (main Main) FindGroupActionById(id string) (MetricsGroupAction, error) {
	metricsGroupAction := MetricsGroupAction{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroupAction)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindActionById", db.Error, "Id = "+id)
		return MetricsGroupAction{}, db.Error
	}

	return metricsGroupAction, nil
}

func (main Main) DeleteGroupAction(id string) error {
	db := main.db.Model(&MetricsGroupAction{}).Where("id = ?", id).Delete(&MetricsGroupAction{})
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

	sort.Slice(executions, func(i, j int) bool {
		if executions[i].StartedAt == nil {
			return false
		} else if executions[j].StartedAt == nil {
			return true
		}

		return executions[i].StartedAt.After(*executions[j].StartedAt)
	})

	return executions, nil
}

func (main Main) ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupAction) bool {
	count, err := main.getNumberOfActionExecutions(metricsGroupAction.ID)
	if err != nil {
		logger.Error(util.ActionExecutionValidateError, "ValidateActionCanBeExecuted", err, fmt.Sprintf("%+v", metricsGroupAction))
		return false
	}

	return metricsGroupAction.ActionsConfiguration.Repeatable || int64(metricsGroupAction.ActionsConfiguration.NumberOfCycles) > count
}
