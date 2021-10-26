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

package api

import (
	"fmt"

	"github.com/gorilla/mux"

	"github.com/ZupIT/charlescd/compass/web/api/v1/plugin"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metricsgroupaction"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metric"

	"github.com/ZupIT/charlescd/compass/web/api/v1/circle"

	"github.com/ZupIT/charlescd/compass/web/api/v1/datasource"

	"github.com/ZupIT/charlescd/compass/web/api/v1/action"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metricsgroup"
)

func (api *API) newV1Api(router *mux.Router) {
	s := router.PathPrefix("/v1").Subrouter()
	{
		path := "/actions"
		s.HandleFunc(path, action.List(api.actionMain)).Methods("GET")
		s.HandleFunc(path, action.Create(api.actionMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{actionID}", path), action.Delete(api.actionMain)).Methods("DELETE")
	}
	{
		path := "/datasources"
		s.HandleFunc(path, datasource.FindAllByWorkspace(api.datasourceMain)).Methods("GET")
		s.HandleFunc(path, datasource.Create(api.datasourceMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{datasourceID}", path), datasource.Delete(api.datasourceMain)).Methods("DELETE")
		s.HandleFunc(fmt.Sprintf("%s/{datasourceID}/metrics", path), datasource.GetMetrics(api.datasourceMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/test-connection", path), datasource.TestConnection(api.datasourceMain)).Methods("POST")

	}
	{
		path := "/metrics-groups"
		s.HandleFunc(path, metricsgroup.Create(api.metricsGroupMain)).Methods("POST")
		s.HandleFunc(path, metricsgroup.GetAll(api.metricsGroupMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.Show(api.metricsGroupMain)).Methods("GET", "PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/query", path), metricsgroup.Query(api.metricsGroupMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/result", path), metricsgroup.Result(api.metricsGroupMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.Update(api.metricsGroupMain)).Methods("PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.UpdateName(api.metricsGroupMain)).Methods("PATCH") // TODO: Discutir necessidade desse patch
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.Delete(api.metricsGroupMain)).Methods("DELETE")
		s.HandleFunc(fmt.Sprintf("/resume%s", path), metricsgroup.Resume(api.metricsGroupMain)).Methods("GET")
	}
	{
		path := "/metrics-groups"
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/metrics", path), metric.Create(api.metricMain, api.metricsGroupMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/metrics/{metricID}", path), metric.Update(api.metricMain)).Methods("PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/metrics/{metricID}", path), metric.Delete(api.metricMain)).Methods("DELETE")
	}
	{
		path := "/group-actions"
		s.HandleFunc(path, metricsgroupaction.Create(api.metricGroupActionMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), metricsgroupaction.FindByID(api.metricGroupActionMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), metricsgroupaction.Update(api.metricGroupActionMain)).Methods("PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), metricsgroupaction.Delete(api.metricGroupActionMain)).Methods("DELETE")
	}
	{
		path := "/circles"
		s.HandleFunc(fmt.Sprintf("%s/{circleID}/metrics-groups", path), circle.ListMetricGroupInCircle(api.metricsGroupMain)).Methods("GET")
	}
	{
		path := "/plugins"
		s.HandleFunc(path, plugin.List(api.pluginMain)).Methods("GET")
	}
}
