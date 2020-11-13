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
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	healthPKG "github.com/ZupIT/charlescd/compass/internal/health"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/julienschmidt/httprouter"
)

type UseCases interface {
	Start()
	NewPluginApi(pluginMain plugin.UseCases) PluginApi
	NewMetricsGroupApi(metricsGroupMain metricsgroup.UseCases) MetricsGroupApi
	NewMetricApi(metricMain metric.UseCases, metricGroupMain metricsgroup.UseCases) MetricApi
	NewDataSourceApi(dataSourceMain datasource.UseCases) DataSourceApi
	NewCircleApi(circleMain metricsgroup.UseCases) CircleApi
	NewHealthApi(healthMain healthPKG.UseCases) HealthApi
	NewActionApi(actionMain action.UseCases) ActionApi
	NewMetricsGroupActionApi(actionMain metricsgroupaction.UseCases) MetricsGroupActionApi
}

type V1 struct {
	Router *httprouter.Router
	Path   string
}

const (
	v1Path = "/api/v1"
)

func NewV1() UseCases {
	router := httprouter.New()
	router.GET("/health", health)
	router.GET("/metrics", metricHandler)

	return V1{router, v1Path}
}

func metricHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	promhttp.Handler().ServeHTTP(w, r)
}

func (v1 V1) getCompletePath(path string) string {
	return fmt.Sprintf("%s%s", v1Path, path)
}

func health(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	w.Write([]byte(":)"))
}

func (v1 V1) Start() {
	logger.Info("Server Started", "Port:8080")
	logger.Fatal("", http.ListenAndServe(":8080", v1.Router))
}
