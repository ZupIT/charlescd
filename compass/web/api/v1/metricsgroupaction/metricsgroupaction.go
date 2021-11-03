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
	"net/http"

	"github.com/gorilla/mux"

	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/web/api/util"
	"github.com/google/uuid"
)

func Create(metricsgroupactionMain metricsgroupaction.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		newActionGroup, err := metricsgroupactionMain.ParseGroupAction(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}

		newActionGroup.ActionsConfiguration = metricsgroupaction.ActionsConfiguration{
			Repeatable:     false,
			NumberOfCycles: 1,
		}

		if err := metricsgroupactionMain.ValidateGroupAction(newActionGroup, workspaceUUID); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		created, err := metricsgroupactionMain.SaveGroupAction(newActionGroup)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusCreated, created)
	}
}

func Update(metricsgroupactionMain metricsgroupaction.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricgroupactionID"]
		newActionGroup, err := metricsgroupactionMain.ParseGroupAction(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		newActionGroup.ActionsConfiguration = metricsgroupaction.ActionsConfiguration{
			Repeatable:     false,
			NumberOfCycles: 1,
		}

		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}

		if err := metricsgroupactionMain.ValidateGroupAction(newActionGroup, workspaceUUID); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		updated, err := metricsgroupactionMain.UpdateGroupAction(id, newActionGroup)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, updated)
	}
}

func FindByID(metricsgroupactionMain metricsgroupaction.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricgroupactionID"]

		act, err := metricsgroupactionMain.FindGroupActionByID(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, act)
	}
}

func Delete(metricsgroupactionMain metricsgroupaction.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["metricgroupactionID"]

		err := metricsgroupactionMain.DeleteGroupAction(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusNoContent, nil)
	}
}
