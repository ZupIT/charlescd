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
	healthPKG "compass/internal/health"
	"compass/web/api"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type HealthApi struct {
	healthMain healthPKG.UseCases
}

func (v1 V1) NewHealthApi(healthMain healthPKG.UseCases) HealthApi {
	apiPath := "/application-health"
	healthApi := HealthApi{healthMain}
	v1.Router.GET(v1.getCompletePath(apiPath)+"/:circleId/components", api.HttpValidator(healthApi.components))
	v1.Router.GET(v1.getCompletePath(apiPath)+"/:circleId/components/health", api.HttpValidator(healthApi.componentsHealth))
	return healthApi
}

func (healthApi HealthApi) components(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	projectionType := r.URL.Query().Get("projectionType")
	metricType := r.URL.Query().Get("metricType")
	workspaceID := r.Header.Get("x-workspace-id")
	circleIDHeader := r.Header.Get(("x-circle-id"))
	circleId := ps.ByName("circleId")

	circles, err := healthApi.healthMain.Components(circleIDHeader, workspaceID, circleId, projectionType, metricType)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, circles)
}

func (healthApi HealthApi) componentsHealth(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	workspaceID := r.Header.Get("x-workspace-id")
	circleIDHeader := r.Header.Get(("x-circle-id"))
	circleId := ps.ByName("circleId")

	circles, err := healthApi.healthMain.ComponentsHealth(circleIDHeader, workspaceID, circleId)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, circles)
}
