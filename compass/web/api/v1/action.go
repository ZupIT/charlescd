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

package v1

import (
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/web/api"
	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type ActionApi struct {
	actionMain action.UseCases
}

func (v1 V1) NewActionApi(actionMain action.UseCases) ActionApi {
	apiPath := "/actions"
	actionApi := ActionApi{actionMain}

	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(actionApi.list))
	v1.Router.POST(v1.getCompletePath(apiPath), api.HttpValidator(actionApi.create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(actionApi.delete))

	return actionApi
}

func (actionApi ActionApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	request, err := actionApi.actionMain.ParseAction(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid payload")})
		return
	}

	workspaceUuid, err := uuid.Parse(workspaceId)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid workspaceID")})
		return
	}
	request.WorkspaceId = workspaceUuid

	if err := actionApi.actionMain.ValidateAction(request); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "could not save action")
		return
	}

	createdAction, err := actionApi.actionMain.SaveAction(request)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error saving action")})
		return
	}

	api.NewRestSuccess(w, http.StatusCreated, createdAction)
}

func (actionApi ActionApi) list(w http.ResponseWriter, _ *http.Request, _ httprouter.Params, workspaceId string) {
	actions, err := actionApi.actionMain.FindAllActionsByWorkspace(workspaceId)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error listing actions")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, actions)
}

func (actionApi ActionApi) delete(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	err := actionApi.actionMain.DeleteAction(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error deleting action")})
		return
	}

	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
