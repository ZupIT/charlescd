package api

import (
	"log"
	"net/http"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/ZupIT/charlescd/compass/internal/health"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/gorilla/mux"
)

type Api struct {
	// Dependencies
	pluginMain            plugin.UseCases
	datasourceMain        datasource.UseCases
	metricMain            metric.UseCases
	actionMain            action.UseCases
	metricGroupActionMain metricsgroupaction.UseCases
	metricsGroupMain      metricsgroup.UseCases
	mooveMain             moove.UseCases
	healthMain            health.UseCases

	//Server
	router *mux.Router
	server *http.Server
}

func NewApi(
	pluginMain plugin.UseCases,
	datasourceMain datasource.UseCases,
	metricMain metric.UseCases,
	actionMain action.UseCases,
	metricGroupActionMain metricsgroupaction.UseCases,
	metricsGroupMain metricsgroup.UseCases,
	mooveMain moove.UseCases,
	healthMain health.UseCases,
) Api {

	api := Api{
		pluginMain:            pluginMain,
		datasourceMain:        datasourceMain,
		metricMain:            metricMain,
		actionMain:            actionMain,
		metricGroupActionMain: metricGroupActionMain,
		metricsGroupMain:      metricsGroupMain,
		mooveMain:             mooveMain,
		healthMain:            healthMain,
		router:                mux.NewRouter(),
	}
	api.server = &http.Server{
		Handler: api.router,
		Addr:    ":8080",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	api.router.PathPrefix("/api")
	api.router.Use(LoggingMiddleware)
	api.router.Use(ValidatorMiddleware)
	api.health()
	api.newV1Api()

	return api
}

func (api *Api) health() {
	api.router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(":)"))
		return
	})
}

func (api Api) Start() {
	log.Fatal(api.server.ListenAndServe())
}
