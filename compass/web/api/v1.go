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

package api

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/web/api/handlers"

	"github.com/gorilla/mux"
)

func (api *Api) newV1Api(router *mux.Router) {
	s := router.PathPrefix("/v1").Subrouter()
	{
		path := "/actions"
		s.HandleFunc(path, handlers.List(api.actionMain)).Methods("GET")
		s.HandleFunc(path, handlers.Create(api.actionMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{actionID}", path), handlers.Delete(api.actionMain)).Methods("DELETE")
	}
	{
		path := "/datasources"
		s.HandleFunc(path, handlers.FindAllByWorkspace(api.datasourceMain)).Methods("GET")
		s.HandleFunc(path, handlers.CreateDatasource(api.datasourceMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{datasourceID}", path), handlers.DeleteDatasource(api.datasourceMain)).Methods("DELETE")
		s.HandleFunc(fmt.Sprintf("%s/{datasourceID}/metrics", path), handlers.GetMetrics(api.datasourceMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/test-connection", path), handlers.TestConnection(api.datasourceMain)).Methods("POST")

	}
	{
		path := "/metrics-groups"
		s.HandleFunc(path, handlers.CreateMetricsGroup(api.metricsGroupMain)).Methods("POST")
		s.HandleFunc(path, handlers.GetAll(api.metricsGroupMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), handlers.Show(api.metricsGroupMain)).Methods("GET", "PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/query", path), handlers.Query(api.metricsGroupMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/result", path), handlers.Result(api.metricsGroupMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), handlers.UpdateMetricsGroup(api.metricsGroupMain)).Methods("PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), handlers.UpdateName(api.metricsGroupMain)).Methods("PATCH") // TODO: Discutir necessidade desse patch
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), handlers.DeleteMetricsGroup(api.metricsGroupMain)).Methods("DELETE")
		s.HandleFunc(fmt.Sprintf("/resume%s", path), handlers.Resume(api.metricsGroupMain)).Methods("GET")
	}
	{
		path := "/metrics-groups"
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/metrics", path), handlers.CreateMetric(api.metricMain, api.metricsGroupMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/metrics/{metricID}", path), handlers.UpdateMetric(api.metricMain)).Methods("PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/metrics/{metricID}", path), handlers.DeleteMetric(api.metricMain)).Methods("DELETE")
	}
	{
		path := "/group-actions"
		s.HandleFunc(path, handlers.CreateMetricsGroupAction(api.metricGroupActionMain)).Methods("POST")
		s.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), handlers.FindByID(api.metricGroupActionMain)).Methods("GET")
		s.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), handlers.Update(api.metricGroupActionMain)).Methods("PUT")
		s.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), handlers.DeleteMetricsGroupAction(api.metricGroupActionMain)).Methods("DELETE")
	}
	{
		path := "/circles"
		s.HandleFunc(fmt.Sprintf("%s/{circleID}/metrics-groups", path), handlers.ListMetricGroupInCircle(api.metricsGroupMain)).Methods("GET")
	}
	{
		path := "/plugins"
		s.HandleFunc(path, handlers.ListPlugins(api.pluginMain)).Methods("GET")
	}
}
