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
	"compass/internal/datasource"
	"compass/web/api"
	"errors"
	"github.com/google/uuid"
	"net/http"

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
	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(dataSourceAPI.findAllByWorkspace))
	v1.Router.POST(v1.getCompletePath(apiPath), api.HttpValidator(dataSourceAPI.create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(dataSourceAPI.deleteDataSource))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/metrics"), api.HttpValidator(dataSourceAPI.getMetrics))
	return dataSourceAPI
}

func (dataSourceApi DataSourceApi) findAllByWorkspace(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	dataSources, dbErr := dataSourceApi.dataSourceMain.FindAllByWorkspace(workspaceId, r.URL.Query().Get("healthy"))
	if dbErr != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("Error doing the process")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, dataSources)
}

func (dataSourceApi DataSourceApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	dataSource, err := dataSourceApi.dataSourceMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	dataSource.WorkspaceID, err = uuid.Parse(workspaceId)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

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

func (dataSourceApi DataSourceApi) deleteDataSource(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	err := dataSourceApi.dataSourceMain.Delete(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (dataSourceApi DataSourceApi) getMetrics(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	metrics, err := dataSourceApi.dataSourceMain.GetMetrics(ps.ByName("id"), "")
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	api.NewRestSuccess(w, http.StatusOK, metrics)
}
