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
	"compass/internal/metricsgroup"
	"compass/web/api"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type CircleApi struct {
	circleMain metricsgroup.UseCases
}

func (v1 V1) NewCircleApi(circleMain metricsgroup.UseCases) CircleApi {
	apiPath := "/circles"
	circleApi := CircleApi{circleMain}
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/metrics-groups"), api.HttpValidator(circleApi.ListMetricsGroupInCircle))

	return circleApi
}

func (circleApi CircleApi) ListMetricsGroupInCircle(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")
	metricsGroups, err := circleApi.circleMain.FindCircleMetricGroups(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, metricsGroups)
}
