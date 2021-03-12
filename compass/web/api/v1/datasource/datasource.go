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

package datasource

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/ZupIT/charlescd/compass/web/api/util"
	"github.com/gorilla/mux"

	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/google/uuid"
)

func FindAllByWorkspace(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}

		dataSources, dbErr := datasourceMain.FindAllByWorkspace(workspaceUUID)
		if dbErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, []error{errors.New("error doing the process")})
			return
		}

		util.NewResponse(w, http.StatusOK, dataSources)
	}
}

type TestConnectionData struct {
	PluginSrc string          `json:"pluginSrc"`
	Data      json.RawMessage `json:"data"`
}

func TestConnection(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var newTestConnection TestConnectionData
		err := json.NewDecoder(r.Body).Decode(&newTestConnection)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, []error{err})
			return
		}

		testConnErr := datasourceMain.TestConnection(newTestConnection.PluginSrc, newTestConnection.Data)
		if testConnErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, testConnErr)
			return
		}

		util.NewResponse(w, http.StatusNoContent, nil)
	}
}

func Create(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		dataSource, err := datasourceMain.Parse(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID := uuid.MustParse(workspaceID)

		dataSource.WorkspaceID = workspaceUUID
		if err := datasourceMain.Validate(dataSource); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		createdDataSource, err := datasourceMain.Save(dataSource)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, createdDataSource)
	}
}

func Delete(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["datasourceID"]
		err := datasourceMain.Delete(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		util.NewResponse(w, http.StatusNoContent, nil)
	}
}

func GetMetrics(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["datasourceID"]
		metrics, err := datasourceMain.GetMetrics(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		util.NewResponse(w, http.StatusOK, metrics)
	}
}
