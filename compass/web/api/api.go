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
) *mux.Router {

	api := Api{
		pluginMain:            pluginMain,
		datasourceMain:        datasourceMain,
		metricMain:            metricMain,
		actionMain:            actionMain,
		metricGroupActionMain: metricGroupActionMain,
		metricsGroupMain:      metricsGroupMain,
		mooveMain:             mooveMain,
		healthMain:            healthMain,
	}
	router := mux.NewRouter()
	s := router.PathPrefix("/api").Subrouter()

	router.Use(LoggingMiddleware)
	router.Use(ValidatorMiddleware)
	api.health(router)
	api.newV1Api(s)

	return router
}

func (api *Api) health(router *mux.Router) {
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(":)"))
		return
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
