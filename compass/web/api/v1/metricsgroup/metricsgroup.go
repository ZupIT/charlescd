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

package metricsgroup

import (
	"net/http"

	"github.com/ZupIT/charlescd/compass/pkg/errors"

	"github.com/gorilla/mux"

	"github.com/google/uuid"

	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/web/api/util"
)

func GetAll(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		workspaceID := r.Header.Get("x-workspace-id")

		parsedWorkspaceID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
			return
		}

		list, err := metricsgroupMain.FindAllByWorkspaceID(parsedWorkspaceID)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, list)
	}
}

func Resume(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		circleID := r.URL.Query().Get("circleId")

		metricGroups, err := metricsgroupMain.ResumeByCircle(circleID)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, metricGroups)
	}
}

func Create(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		metricsGroup, err := metricsgroupMain.Parse(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}
		metricsGroup.WorkspaceID = workspaceUUID

		if err := metricsgroupMain.Validate(metricsGroup); len(err.Get().Errors) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		createdCircle, err := metricsgroupMain.Save(metricsGroup)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, createdCircle)
	}
}

func Show(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricGroupID"]
		metricsGroup, err := metricsgroupMain.FindByID(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, metricsGroup)
	}
}

func Query(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricGroupID"]

		periodParameter := r.URL.Query().Get("period")
		intervalParameter := r.URL.Query().Get("interval")
		if periodParameter == "" || intervalParameter == "" {
			util.NewResponse(w, http.StatusInternalServerError, errors.NewError("Invalid parameters", "Period or interval params is required"))
			return
		}

		ragePeriod, err := metricsgroupMain.PeriodValidate(periodParameter)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		interval, err := metricsgroupMain.PeriodValidate(intervalParameter)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		queryResult, err := metricsgroupMain.QueryByGroupID(id, ragePeriod, interval)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, queryResult)
	}
}

func Result(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricGroupID"]

		queryResult, err := metricsgroupMain.ResultByID(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, queryResult)
	}
}

func Update(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricGroupID"]
		metricsGroup, err := metricsgroupMain.Parse(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		updatedWorkspace, err := metricsgroupMain.Update(id, metricsGroup)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, updatedWorkspace)
	}
}

func UpdateName(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricGroupID"]
		metricsGroupAux, err := metricsgroupMain.Parse(r.Body)

		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		metricsGroup, err := metricsgroupMain.FindByID(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		metricsGroup.Name = metricsGroupAux.Name
		if err := metricsgroupMain.Validate(metricsGroup); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		updatedWorkspace, err := metricsgroupMain.UpdateName(id, metricsGroup)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		util.NewResponse(w, http.StatusOK, updatedWorkspace)
	}
}

func Delete(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricGroupID"]
		err := metricsgroupMain.Remove(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusNoContent, nil)
	}
}
