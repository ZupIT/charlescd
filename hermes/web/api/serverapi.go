package api

import (
	"github.com/gorilla/mux"
	"hermes/internal/publisher"
	"hermes/internal/subscription"
	"hermes/internal/subscriptionexecution"
	"log"
	"net/http"
	"time"
)

type Api struct {
	// Dependencies
	subscriptionMain      subscription.UseCases
	subscriptionExecution subscriptionexecution.UseCases
	publisherMain         publisher.UseCases
}

func NewApi(subscriptionMain subscription.UseCases, subscriptionExecution subscriptionexecution.UseCases, publisherMain publisher.UseCases) *mux.Router {
	api := Api{
		subscriptionMain:      subscriptionMain,
		subscriptionExecution: subscriptionExecution,
		publisherMain: publisherMain,
	}
	router := mux.NewRouter()
	s := router.PathPrefix("/api").Subrouter()

	router.Use(LoggingMiddleware)
	router.Use(ValidatorMiddleware)
	api.health(router)
	api.newV1Api(s)

	return router
}

func (api *Api) health(r *mux.Router) {
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(":)"))
		return
	})
}

func Start(r *mux.Router) {
	server := &http.Server{
		Handler:      r,
		Addr:         ":8080",
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}
	log.Fatal(server.ListenAndServe())
}
