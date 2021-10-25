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
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"log"
	"net/http"
	"time"

	"github.com/didip/tollbooth/limiter"

	"github.com/casbin/casbin/v2"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/gorilla/mux"
)

type API struct {
	// Dependencies
	enforcer              *casbin.Enforcer
	limiter               *limiter.Limiter
	pluginMain            plugin.UseCases
	datasourceMain        datasource.UseCases
	metricMain            metric.UseCases
	actionMain            action.UseCases
	metricGroupActionMain metricsgroupaction.UseCases
	metricsGroupMain      metricsgroup.UseCases
	mooveMain             moove.UseCases
}

func NewAPI(
	enforcer *casbin.Enforcer,
	limiter *limiter.Limiter,
	pluginMain plugin.UseCases,
	datasourceMain datasource.UseCases,
	metricMain metric.UseCases,
	actionMain action.UseCases,
	metricGroupActionMain metricsgroupaction.UseCases,
	metricsGroupMain metricsgroup.UseCases,
	mooveMain moove.UseCases,
) *mux.Router {

	api := API{
		enforcer:              enforcer,
		limiter:               limiter,
		pluginMain:            pluginMain,
		datasourceMain:        datasourceMain,
		metricMain:            metricMain,
		actionMain:            actionMain,
		metricGroupActionMain: metricGroupActionMain,
		metricsGroupMain:      metricsGroupMain,
		mooveMain:             mooveMain,
	}
	router := mux.NewRouter()
	api.health(router)
	api.metrics(router)

	s := router.PathPrefix("/api").Subrouter()
	s.Use(LoggingMiddleware)
	s.Use(api.ValidatorMiddleware)

	api.newV1Api(s)

	return router
}

func (api *API) health(router *mux.Router) {
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte(":)"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	})
}

func (api *API) metrics(router *mux.Router) {
	router.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		promhttp.Handler().ServeHTTP(w, r)
	})
}

func Start(router *mux.Router) {
	server := &http.Server{
		Handler: router,
		Addr:    ":8080",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(server.ListenAndServe())
}
