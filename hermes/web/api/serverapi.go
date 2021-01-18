package api

import (
	"github.com/gorilla/mux"
	"hermes/internal/message"
	"hermes/internal/messageexecutionhistory"
	"hermes/internal/publisher"
	"hermes/internal/subscription"
	"log"
	"net/http"
	"time"
)

type Api struct {
	// Dependencies
	subscriptionMain subscription.UseCases
	messageMain      message.UseCases
	executionMain    messageexecutionhistory.UseCases
	publisherMain    publisher.UseCases
}

func NewApi(subscriptionMain subscription.UseCases, messageMain message.UseCases, executionMain messageexecutionhistory.UseCases, publisherMain publisher.UseCases) *mux.Router {
	api := Api{
		subscriptionMain: subscriptionMain,
		messageMain:      messageMain,
		executionMain:    executionMain,
		publisherMain:    publisherMain,
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
