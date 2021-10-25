/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"encoding/json"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
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
	ID         string     `json:"id"`
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

func (main Main) ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, errors.Error) {
	var mgAct MetricsGroupAction

	err := json.NewDecoder(metricsGroupAction).Decode(&mgAct)
	if err != nil {
		return MetricsGroupAction{}, errors.NewError("Parse error", err.Error()).
			WithOperations("ParseGroupAction.Decode")
	}

	mgAct.Nickname = strings.TrimSpace(mgAct.Nickname)

	return mgAct, nil
}

func (main Main) ValidateGroupAction(metricsGroupAction MetricsGroupAction, workspaceID uuid.UUID) errors.ErrorList {
	ers := errors.NewErrorList()
	needConfigValidation := true

	if strings.TrimSpace(metricsGroupAction.Nickname) == "" {
		err := errors.NewError("Validate error", "action nickname is required").
			WithMeta("field", "nickname").
			WithOperations("ValidateGroupAction.NicknameTrimSpace")
		ers.Append(err)
	} else if len(metricsGroupAction.Nickname) > 100 {
		err := errors.NewError("Validate error", "nickname is limited to 100 characters maximum").
			WithMeta("field", "nickname").
			WithOperations("ValidateGroupAction.NicknameLen")
		ers.Append(err)
	}

	if metricsGroupAction.ExecutionParameters == nil || len(metricsGroupAction.ExecutionParameters) == 0 {
		needConfigValidation = false
		err := errors.NewError("Validate error", "execution parameters is required").
			WithMeta("field", "executionParameters").
			WithOperations("ValidateGroupAction.ExecutionParametersIsNil")
		ers.Append(err)
	}

	if metricsGroupAction.MetricsGroupID == uuid.Nil {
		err := errors.NewError("Validate error", "metric group id is required").
			WithMeta("field", "metricGroup").
			WithOperations("ValidateGroupAction.MetricGroupIsNil")
		ers.Append(err)
	}

	var act action.Response
	if metricsGroupAction.ActionID == uuid.Nil {
		needConfigValidation = false
		err := errors.NewError("Validate error", "action id is required").
			WithMeta("field", "action").
			WithOperations("ValidateGroupAction.ActionIsNil")
		ers.Append(err)
	} else {
		var err errors.Error
		act, err = main.actionRepo.FindActionByIDAndWorkspace(metricsGroupAction.ActionID, workspaceID)
		if err != nil || act.Type == "" {
			needConfigValidation = false
			err := errors.NewError("Validate error", "action is invalid").
				WithMeta("field", "action").
				WithOperations("ValidateGroupAction.FindActionByIDAndWorkspace")
			ers.Append(err)
		}
	}

	ers.Append(main.validateJobConfiguration(metricsGroupAction.ActionsConfiguration).GetErrors()...)

	if needConfigValidation {
		ers.Append(main.validateExecutionConfig(act.Type, metricsGroupAction.ExecutionParameters).GetErrors()...)
	}

	return ers
}

func (main Main) validateJobConfiguration(configuration ActionsConfiguration) errors.ErrorList {
	ers := errors.NewErrorList()

	if configuration.NumberOfCycles < 0 {
		err := errors.NewError("Validate error", "the number of cycle needs an positive integer").
			WithMeta("field", "configuration.NumberOfCycles").
			WithOperations("validateJobConfiguration.NumberOfCyclesLen")
		ers.Append(err)
	}

	if !configuration.Repeatable && configuration.NumberOfCycles == 0 {
		err := errors.NewError("Validate error", "a not repeatable action needs a defined number of cycles").
			WithMeta("field", "configuration.Repeatable").
			WithOperations("validateJobConfiguration.RepeatableLen")
		ers.Append(err)
	}

	return ers
}

func (main Main) validateExecutionConfig(actionType string, executionConfiguration json.RawMessage) errors.ErrorList {
	ers := errors.NewErrorList()

	plugin, err := main.pluginRepo.GetPluginBySrc(fmt.Sprintf("action/%s/%s", actionType, actionType))
	if err != nil {
		err := err.WithMeta("field", "action").
			WithOperations("validateExecutionConfig.GetPluginBySrc")
		ers.Append(err)
		return ers
	}

	pluginErrs, lookupErr := plugin.Lookup("ValidateExecutionConfiguration")
	if lookupErr != nil {
		err := errors.NewError("Validate error", lookupErr.Error()).
			WithMeta("field", "action").
			WithOperations("validateExecutionConfig.Lookup")
		ers.Append(err)
		return ers
	}

	configErs := pluginErrs.(func(executionConfig []byte) []error)(executionConfiguration)
	if len(configErs) > 0 {
		for _, configErr := range configErs {
			err := errors.NewError("Validate error", configErr.Error()).
				WithMeta("field", "executionParameters").
				WithOperations("validateExecutionConfig.pluginErrs")
			ers.Append(err)
		}
	}

	return ers
}

func (main Main) SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, errors.Error) {
	db := main.db.Create(&metricsGroupAction)
	if db.Error != nil {
		return MetricsGroupAction{}, errors.NewError("Save error", db.Error.Error()).
			WithOperations("SaveGroupAction.Create")
	}

	return metricsGroupAction, nil
}

func (main Main) UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, errors.Error) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return MetricsGroupAction{}, errors.NewError("Update error", err.Error()).
			WithOperations("UpdateGroupAction.Parse")
	}

	metricsGroupAction.BaseModel.ID = parsedID
	db := main.db.Save(&metricsGroupAction)
	if db.Error != nil {
		return MetricsGroupAction{}, errors.NewError("Update error", db.Error.Error()).
			WithOperations("UpdateGroupAction.Save")
	}

	return metricsGroupAction, nil
}

func (main Main) FindGroupActionByID(id string) (MetricsGroupAction, errors.Error) {
	metricsGroupAction := MetricsGroupAction{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&metricsGroupAction)
	if db.Error != nil {
		return MetricsGroupAction{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("FindGroupActionByID.First")
	}

	return metricsGroupAction, nil
}

func (main Main) DeleteGroupAction(id string) errors.Error {
	db := main.db.Model(&MetricsGroupAction{}).Where("id = ?", id).Delete(&MetricsGroupAction{})
	if db.Error != nil {
		return errors.NewError("Delete error", db.Error.Error()).
			WithOperations("DeleteGroupAction.Delete")
	}

	return nil
}

func (main Main) ListGroupActionExecutionResumeByGroup(groupID string) ([]GroupActionExecutionStatusResume, errors.Error) {
	var executions []GroupActionExecutionStatusResume
	result := main.db.Raw(groupActionQuery, groupID).Find(&executions)
	if result.Error != nil {
		return nil, errors.NewError("List error", result.Error.Error()).
			WithOperations("ListGroupActionExecutionResumeByGroup.Find")
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
		return false
	}

	return metricsGroupAction.ActionsConfiguration.Repeatable || int64(metricsGroupAction.ActionsConfiguration.NumberOfCycles) > count
}
