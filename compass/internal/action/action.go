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

package action

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/google/uuid"
	"io"
	"strings"
	"time"
)

type Action struct {
	util.BaseModel
	WorkspaceId   uuid.UUID       `json:"workspaceId"`
	Nickname      string          `json:"nickname"`
	Type          string          `json:"type"`
	Description   string          `json:"description"`
	UseDefault    bool            `json:"useDefaultConfiguration" gorm:"-"`
	Configuration json.RawMessage `json:"configuration"`
	DeletedAt     *time.Time      `json:"-"`
}

func (main Main) ParseAction(action io.ReadCloser) (Action, error) {
	var nAction *Action

	err := json.NewDecoder(action).Decode(&nAction)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, action)
		return Action{}, err
	}

	nAction.Nickname = strings.TrimSpace(nAction.Nickname)
	nAction.Type = strings.TrimSpace(nAction.Type)
	nAction.Description = strings.TrimSpace(nAction.Description)

	if nAction.UseDefault {
		nAction.Configuration = json.RawMessage(fmt.Sprintf(`{"mooveUrl": "%s"}`, configuration.GetConfiguration("MOOVE_PATH")))
	}

	return *nAction, nil
}

func (main Main) ValidateAction(action Action) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)
	needConfigValidation := true

	if strings.TrimSpace(action.Nickname) == "" {
		ers = append(ers, util.ErrorUtil{Field: "nickname", Error: errors.New("action nickname is required").Error()})
	} else if len(action.Nickname) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "nickname", Error: errors.New("action nickname is limited to 100 characters maximum").Error()})
	}

	if strings.TrimSpace(action.Description) == "" {
		ers = append(ers, util.ErrorUtil{Field: "description", Error: errors.New("description is required").Error()})
	} else if len(action.Description) > 100 {
		ers = append(ers, util.ErrorUtil{Field: "description", Error: errors.New("description is limited to 100 characters maximum").Error()})
	}

	if action.Configuration == nil || len(action.Configuration) == 0 {
		ers = append(ers, util.ErrorUtil{Field: "configuration", Error: errors.New("action configuration is required").Error()})
		needConfigValidation = false
	}

	if action.WorkspaceId == uuid.Nil {
		ers = append(ers, util.ErrorUtil{Field: "workspaceId", Error: errors.New("workspaceId is required").Error()})
	}

	if strings.TrimSpace(action.Type) == "" {
		needConfigValidation = false
		ers = append(ers, util.ErrorUtil{Field: "type", Error: errors.New("action type is required").Error()})
	} else if len(action.Type) > 100 {
		needConfigValidation = false
		ers = append(ers, util.ErrorUtil{Field: "type", Error: errors.New("action type is limited to 100 characters maximum").Error()})
	}

	if needConfigValidation {
		ers = append(ers, main.validateActionConfig(action.Type, action.Configuration)...)
	}

	return ers
}

func (main Main) validateActionConfig(actionType string, actionConfiguration json.RawMessage) []util.ErrorUtil {
	ers := make([]util.ErrorUtil, 0)

	plugin, err := main.pluginRepo.GetPluginBySrc(fmt.Sprintf("action/%s/%s", actionType, actionType))
	if err != nil {
		logger.Error("error finding plugin", "ValidateActionConfig", err, actionType)
		return []util.ErrorUtil{{Field: "type", Error: errors.New("action type is invalid").Error()}}
	}

	pluginErrs, err := plugin.Lookup("ValidateActionConfiguration")
	if err != nil {
		logger.Error("error looking up for plugin", "ValidateActionConfig", err, fmt.Sprintf("%+v", plugin))
		return []util.ErrorUtil{{Field: "type", Error: errors.New("action type is invalid").Error()}}
	}

	configErs := pluginErrs.(func(actionConfig []byte) []error)(actionConfiguration)
	if len(configErs) > 0 {
		for _, err := range configErs {
			ers = append(ers, util.ErrorUtil{Field: "configuration", Error: err.Error()})
		}
	}

	return ers
}

func (main Main) FindActionByIdAndWorkspace(id, workspaceID string) (Action, error) {
	action := Action{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ? and workspace_id = ?", id, workspaceID).First(&action)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindActionById", db.Error, "Id = "+id)
		return Action{}, db.Error
	}

	return action, nil
}

func (main Main) FindActionById(id string) (Action, error) {
	action := Action{}
	db := main.db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&action)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindActionById", db.Error, "Id = "+id)
		return Action{}, db.Error
	}

	return action, nil
}

func (main Main) FindAllActionsByWorkspace(workspaceID string) ([]Action, error) {
	var actions []Action

	db := main.db.Set("gorm:auto_preload", true).Where("workspace_id = ?", workspaceID).Find(&actions)
	if db.Error != nil {
		logger.Error(util.FindActionError, "FindAllActionsByWorkspace", db.Error, actions)
		return []Action{}, db.Error
	}
	return actions, nil
}

func (main Main) SaveAction(action Action) (Action, error) {
	db := main.db.Create(&action)
	if db.Error != nil {
		logger.Error(util.SaveActionError, "SaveAction", db.Error, action)
		return Action{}, db.Error
	}
	return action, nil
}

func (main Main) DeleteAction(id string) error {
	db := main.db.Model(&Action{}).Where("id = ?", id).Delete(&Action{})
	if db.Error != nil {
		logger.Error(util.DeleteActionError, "DeleteAction", db.Error, "Id = "+id)
		return db.Error
	}
	return nil
}
