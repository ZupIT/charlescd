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

package action

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/google/uuid"
)

type Action struct {
	util.BaseModel
	WorkspaceID   uuid.UUID  `json:"workspaceId"`
	Nickname      string     `json:"nickname"`
	Type          string     `json:"type"`
	Description   string     `json:"description"`
	UseDefault    bool       `json:"useDefaultConfiguration" gorm:"-"`
	Configuration []byte     `json:"configuration"`
	DeletedAt     *time.Time `json:"-"`
}

type Request struct {
	util.BaseModel
	WorkspaceID   uuid.UUID       `json:"workspaceId"`
	Nickname      string          `json:"nickname"`
	Type          string          `json:"type"`
	Description   string          `json:"description"`
	UseDefault    bool            `json:"useDefaultConfiguration" gorm:"-"`
	Configuration json.RawMessage `json:"configuration"`
	DeletedAt     *time.Time      `json:"-"`
}

type Response struct {
	util.BaseModel
	WorkspaceID   uuid.UUID       `json:"workspaceId"`
	Nickname      string          `json:"nickname"`
	Type          string          `json:"type"`
	Description   string          `json:"description"`
	UseDefault    bool            `json:"useDefaultConfiguration" gorm:"-"`
	Configuration json.RawMessage `json:"configuration"`
	DeletedAt     *time.Time      `json:"-"`
}

func (main Main) ParseAction(action io.ReadCloser) (Request, errors.Error) {
	var nAction *Request

	err := json.NewDecoder(action).Decode(&nAction)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseAction", err, action)
		return Request{}, errors.NewError("Connot decode data", err.Error()).
			WithOperations("ParseAction.Decode")
	}

	nAction.Nickname = strings.TrimSpace(nAction.Nickname)
	nAction.Type = strings.TrimSpace(nAction.Type)
	nAction.Description = strings.TrimSpace(nAction.Description)

	if nAction.UseDefault {
		nAction.Configuration = json.RawMessage(fmt.Sprintf(`{"mooveUrl": "%s"}`, configuration.GetConfiguration("MOOVE_PATH")))
	}

	return *nAction, nil
}

func (main Main) ValidateAction(action Request) errors.ErrorList {
	ers := errors.NewErrorList()
	needConfigValidation := true

	if strings.TrimSpace(action.Nickname) == "" {
		err := errors.NewError("Invalid data", "action nickname is required").
			WithMeta("field", "nickname").
			WithOperations("ValidateAction.NameTrimSpace")
		ers.Append(err)
	} else if len(action.Nickname) > 64 {
		err := errors.NewError("Invalid data", "action nickname is limited to 64 characters maximum").
			WithMeta("field", "nickname").
			WithOperations("ValidateAction.NicknameLen")
		ers.Append(err)
	}

	if strings.TrimSpace(action.Description) == "" {
		err := errors.NewError("Invalid data", "description is required").
			WithMeta("field", "description").
			WithOperations("ValidateAction.DescriptionTrimSpace")
		ers.Append(err)
	} else if len(action.Description) > 64 {
		err := errors.NewError("Invalid data", "description is limited to 64 characters maximum").
			WithMeta("field", "description").
			WithOperations("ValidateAction.DescriptionLen")
		ers.Append(err)
	}

	if action.Configuration == nil || len(action.Configuration) == 0 {
		err := errors.NewError("Invalid data", "action configuration is required").
			WithMeta("field", "configuration").
			WithOperations("ValidateAction.ConfigurationNil")
		ers.Append(err)
		needConfigValidation = false
	}

	if action.WorkspaceID == uuid.Nil {
		err := errors.NewError("Invalid data", "workspaceId is required").
			WithMeta("field", "workspaceId").
			WithOperations("ValidateAction.WorkspaceIdIsNil")
		ers.Append(err)
	}

	if strings.TrimSpace(action.Type) == "" {
		needConfigValidation = false
		err := errors.NewError("Invalid data", "action type is required").
			WithMeta("field", "type").
			WithOperations("ValidateAction.ActionTypeTrimSpace")
		ers.Append(err)
	} else if len(action.Type) > 100 {
		needConfigValidation = false
		err := errors.NewError("Invalid data", "action type is limited to 100 characters maximum").
			WithMeta("field", "type").
			WithOperations("ValidateAction.ActionTypeLen")
		ers.Append(err)
	}

	if needConfigValidation {
		ers.Append(main.validateActionConfig(action.Type, action.Configuration).GetErrors()...)
	}

	return ers
}

func (main Main) validateActionConfig(actionType string, actionConfiguration json.RawMessage) errors.ErrorList {
	ers := errors.NewErrorList()

	plugin, err := main.pluginRepo.GetPluginBySrc(fmt.Sprintf("action/%s/%s", actionType, actionType))
	if err != nil {
		err := errors.NewError("Invalid data", "error finding plugin").
			WithMeta("field", "type").
			WithOperations("validateActionConfig.GetPluginBySrc")
		ers.Append(err)
		return ers
	}

	pluginErrs, lookupErr := plugin.Lookup("ValidateActionConfiguration")
	if lookupErr != nil {
		err := errors.NewError("Invalid data", lookupErr.Error()).
			WithMeta("field", "type").
			WithOperations("validateActionConfig.Lookup")
		ers.Append(err)
		return ers
	}

	configErs := pluginErrs.(func(actionConfig []byte) []error)(actionConfiguration)
	if len(configErs) > 0 {
		for _, err := range configErs {
			newErr := errors.NewError("Invalid data", err.Error()).
				WithMeta("field", "type").
				WithOperations("validateActionConfig.pluginErrs")
			ers.Append(newErr)
		}
	}

	return ers
}

func (main Main) FindActionByIDAndWorkspace(id, workspaceID uuid.UUID) (Response, errors.Error) {
	entity := Action{}
	row := main.db.Set("gorm:auto_preload", true).Raw(decryptedWorkspaceAndIDActionQuery, id, workspaceID).Row()

	dbError := row.Scan(&entity.ID, &entity.WorkspaceID, &entity.Nickname, &entity.Type,
		&entity.Description, &entity.CreatedAt, &entity.DeletedAt, &entity.Configuration)
	if dbError != nil {
		return Response{}, errors.NewError("Find all error", dbError.Error()).
			WithOperations("FindActionByIDAndWorkspace.Raw")
	}

	return entity.toResponse(), nil
}

func (main Main) FindActionByID(id string) (Response, errors.Error) {
	entity := Action{}
	row := main.db.Set("gorm:auto_preload", true).Raw(idActionQuery, id).Row()

	dbError := row.Scan(&entity.ID, &entity.WorkspaceID, &entity.Nickname, &entity.Type,
		&entity.Description, &entity.CreatedAt, &entity.DeletedAt, &entity.Configuration)
	if dbError != nil {
		return Response{}, errors.NewError("Find by id error", dbError.Error()).
			WithOperations("FindActionByID.Raw")
	}

	return entity.toResponse(), nil
}

func (main Main) FindAllActionsByWorkspace(workspaceID uuid.UUID) ([]Response, errors.Error) {
	var actions []Response

	rows, err := main.db.Set("gorm:auto_preload", true).Raw(workspaceActionQuery, workspaceID).Rows()
	if err != nil {
		return []Response{}, errors.NewError("Find all error", err.Error()).
			WithOperations("FindAllActionsByWorkspace.Raw")
	}

	for rows.Next() {
		var action Action

		err = main.db.ScanRows(rows, &action)
		if err != nil {
			return []Response{}, errors.NewError("Find all error", err.Error()).
				WithOperations("FindAllActionsByWorkspace.ScanRows")
		}
		actions = append(actions, action.toResponse())
	}

	return actions, nil
}

func (main Main) SaveAction(action Request) (Response, errors.Error) {
	id := uuid.New().String()
	entity := Action{}

	row := main.db.Exec(Insert(id, action.Nickname, action.Type, action.Description, action.Configuration, action.WorkspaceID)).
		Raw(actionQuery, id).
		Row()

	dbError := row.Scan(&entity.ID, &entity.WorkspaceID, &entity.Nickname, &entity.Type,
		&entity.Description, &entity.CreatedAt, &entity.DeletedAt)
	if dbError != nil {
		return Response{}, errors.NewError("Save error", dbError.Error()).
			WithOperations("SaveAction.Scan")
	}

	return entity.toResponse(), nil
}

func (main Main) DeleteAction(id string) errors.Error {
	db := main.db.Model(&Action{}).Where("id = ?", id).Delete(&Action{})
	if db.Error != nil {
		return errors.NewError("Delete error", db.Error.Error()).
			WithOperations("DeleteAction.Delete")
	}

	return nil
}

func (entity Action) toResponse() Response {
	return Response{
		BaseModel:     entity.BaseModel,
		WorkspaceID:   entity.WorkspaceID,
		Nickname:      entity.Nickname,
		Type:          entity.Type,
		Description:   entity.Description,
		UseDefault:    entity.UseDefault,
		Configuration: entity.Configuration,
		DeletedAt:     entity.DeletedAt,
	}
}
