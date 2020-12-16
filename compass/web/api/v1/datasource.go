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
	"encoding/json"
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/web/api"
	"net/http"

	"github.com/google/uuid"

	"github.com/julienschmidt/httprouter"
)

type dataSourceRepresentation struct {
	api.BaseEntityRepresentation
	Name   string `json:"name"`
	Health bool   `json:"health"`
}

type DataSourceApi struct {
	dataSourceMain datasource.UseCases
}

func (v1 V1) NewDataSourceApi(dataSourceMain datasource.UseCases) DataSourceApi {
	apiPath := "/datasources"
	dataSourceAPI := DataSourceApi{dataSourceMain}
	v1.Router.GET(v1.getCompletePath(apiPath), v1.HttpValidator(dataSourceAPI.findAllByWorkspace))
	v1.Router.POST(v1.getCompletePath(apiPath), v1.HttpValidator(dataSourceAPI.create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(dataSourceAPI.deleteDataSource))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/metrics"), v1.HttpValidator(dataSourceAPI.getMetrics))
	v1.Router.POST(v1.getCompletePath(apiPath+"/test-connection"), v1.HttpValidator(dataSourceAPI.testConnection))
	return dataSourceAPI
}

func (dataSourceApi DataSourceApi) findAllByWorkspace(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceID uuid.UUID) {
	dataSources, dbErr := dataSourceApi.dataSourceMain.FindAllByWorkspace(workspaceID, r.URL.Query().Get("healthy"))
	if dbErr != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error doing the process")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, dataSources)
}

type TestConnection struct {
	PluginSrc string          `json:"pluginSrc"`
	Data      json.RawMessage `json:"data"`
}

func (dataSourceApi DataSourceApi) testConnection(w http.ResponseWriter, r *http.Request, _ httprouter.Params, _ uuid.UUID) {
	var newTestConnection TestConnection
	err := json.NewDecoder(r.Body).Decode(&newTestConnection)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	err = dataSourceApi.dataSourceMain.TestConnection(newTestConnection.PluginSrc, newTestConnection.Data)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusNoContent, nil)
}

func (dataSourceApi DataSourceApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceID uuid.UUID) {
	dataSource, err := dataSourceApi.dataSourceMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	dataSource.WorkspaceID = workspaceID

	if err := dataSourceApi.dataSourceMain.Validate(dataSource); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "Could not create datasource")
		return
	}

	createdDataSource, err := dataSourceApi.dataSourceMain.Save(dataSource)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, createdDataSource)
}

func (dataSourceApi DataSourceApi) deleteDataSource(w http.ResponseWriter, r *http.Request, ps httprouter.Params, _ uuid.UUID) {
	err := dataSourceApi.dataSourceMain.Delete(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (dataSourceApi DataSourceApi) getMetrics(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ uuid.UUID) {
	metrics, err := dataSourceApi.dataSourceMain.GetMetrics(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	api.NewRestSuccess(w, http.StatusOK, metrics)
}
