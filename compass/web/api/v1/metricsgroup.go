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
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/ZupIT/charlescd/compass/web/api"
	"net/http"

	"github.com/google/uuid"

	"github.com/julienschmidt/httprouter"
)

type MetricsGroupApi struct {
	metricsGroupMain metricsgroup.UseCases
}

func (v1 V1) NewMetricsGroupApi(metricsGroupMain metricsgroup.UseCases) MetricsGroupApi {
	apiPath := "/metrics-groups"
	metricsGroupApi := MetricsGroupApi{metricsGroupMain}
	v1.Router.GET(v1.getCompletePath(apiPath), v1.HttpValidator(metricsGroupApi.list))
	v1.Router.POST(v1.getCompletePath(apiPath), v1.HttpValidator(metricsGroupApi.create))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.show))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/query"), v1.HttpValidator(metricsGroupApi.query))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/result"), v1.HttpValidator(metricsGroupApi.result))
	v1.Router.PUT(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.update))
	v1.Router.PATCH(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.updateName))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.delete))
	v1.Router.GET(v1.getCompletePath("/resume"+apiPath), v1.HttpValidator(metricsGroupApi.resume))
	return metricsGroupApi
}

func (metricsGroupApi MetricsGroupApi) list(w http.ResponseWriter, _ *http.Request, _ httprouter.Params, _ string) {
	circles, err := metricsGroupApi.metricsGroupMain.FindAll()
	if err != nil {
		logger.Error("error listing metrics groups", "list", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error listing metrics groups")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, circles)
}

func (metricsGroupApi MetricsGroupApi) resume(w http.ResponseWriter, r *http.Request, _ httprouter.Params, _ string) {
	circleId := r.URL.Query().Get("circleId")

	metricGroups, err := metricsGroupApi.metricsGroupMain.ResumeByCircle(circleId)
	if err != nil {
		logger.Error("error listing metrics groups resume", "resume", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error listing metrics groups resume")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, metricGroups)
}

func (metricsGroupApi MetricsGroupApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	metricsGroup, err := metricsGroupApi.metricsGroupMain.Parse(r.Body)
	if err != nil {
		logger.Error("error parsing metrics groups", "create", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error creating metrics group")})
		return
	}

	metricsGroup.WorkspaceID, err = uuid.Parse(workspaceId)
	if err != nil {
		logger.Error("error parsing metrics groups workspace id", "create", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error creating metrics group")})
		return
	}

	if err := metricsGroupApi.metricsGroupMain.Validate(metricsGroup); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "Could not save metrics-group")
		return
	}

	createdCircle, err := metricsGroupApi.metricsGroupMain.Save(metricsGroup)
	if err != nil {
		logger.Error("error saving metric group", "create", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error creating metrics group")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, createdCircle)
}

func (metricsGroupApi MetricsGroupApi) show(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")
	metricsGroup, err := metricsGroupApi.metricsGroupMain.FindById(id)
	if err != nil {
		logger.Error("error finding metric group", "show", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error finding metric group")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, metricsGroup)
}

func (metricsGroupApi MetricsGroupApi) query(w http.ResponseWriter, r *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")

	periodParameter := r.URL.Query().Get("period")
	intervalParameter := r.URL.Query().Get("interval")
	if periodParameter == "" || intervalParameter == "" {
		api.NewRestError(w, http.StatusInternalServerError, []error{
			errors.New("query param period or interval is empty"),
		})
		return
	}

	ragePeriod, err := metricsGroupApi.metricsGroupMain.PeriodValidate(periodParameter)
	if err != nil {
		logger.Error("error querying metric group", "query", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error querying metric group")})
		return
	}

	interval, err := metricsGroupApi.metricsGroupMain.PeriodValidate(intervalParameter)
	if err != nil {
		logger.Error("error querying metric group", "query", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error querying metric group")})
		return
	}

	queryResult, err := metricsGroupApi.metricsGroupMain.QueryByGroupID(id, ragePeriod, interval)
	if err != nil {
		logger.Error("error querying metric group", "query", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error querying metric group")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, queryResult)
}

func (metricsGroupApi MetricsGroupApi) result(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")

	queryResult, err := metricsGroupApi.metricsGroupMain.ResultByID(id)
	if err != nil {
		logger.Error("error getting metric group result", "result", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error getting metric group result")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, queryResult)
}

func (metricsGroupApi MetricsGroupApi) update(w http.ResponseWriter, r *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")
	metricsGroup, err := metricsGroupApi.metricsGroupMain.Parse(r.Body)
	if err != nil {
		logger.Error("error updating metric group", "update", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error updating ,metric group")})
		return
	}

	updatedWorkspace, err := metricsGroupApi.metricsGroupMain.Update(id, metricsGroup)
	if err != nil {
		logger.Error("error updating metric group", "update", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error updating ,metric group")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, updatedWorkspace)
}

func (metricsGroupApi MetricsGroupApi) updateName(w http.ResponseWriter, r *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")
	metricsGroupAux, err := metricsGroupApi.metricsGroupMain.Parse(r.Body)

	metricsGroup, err := metricsGroupApi.metricsGroupMain.FindById(id)
	if err != nil {
		logger.Error("error updating metric group name", "updateName", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error updating metric group name")})
		return
	}

	metricsGroup.Name = metricsGroupAux.Name
	if err := metricsGroupApi.metricsGroupMain.Validate(metricsGroup); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "Could not save metrics-group")
		return
	}

	updatedWorkspace, err := metricsGroupApi.metricsGroupMain.UpdateName(id, metricsGroup)
	if err != nil {
		logger.Error("error updating metric group name", "updateName", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error updating metric group name")})
		return
	}
	api.NewRestSuccess(w, http.StatusOK, updatedWorkspace)
}

func (metricsGroupApi MetricsGroupApi) delete(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")
	err := metricsGroupApi.metricsGroupMain.Remove(id)
	if err != nil {
		logger.Error("error deleting metric group", "delete", err, nil)
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error deleting metric group")})
		return
	}

	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
