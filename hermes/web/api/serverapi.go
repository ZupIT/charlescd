package api

import (
	"github.com/gorilla/mux"
	"hermes/internal/subscription"
	"hermes/web/router"
	"log"
	"net/http"
	"time"
)

type Api struct {
	// Dependencies
	subscriptionMain subscription.UseCases

	//Server
	router *mux.Router
	server *http.Server
}

func NewApi(subscriptionMain subscription.UseCases) Api {

	api := Api{
		subscriptionMain: subscriptionMain,
		router: mux.NewRouter(),
	}
	api.server = &http.Server{
		Handler: api.router,
		Addr:    ":8080",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	api.router.PathPrefix("/api")
	api.router.Use(router.ValidatorMiddleware)
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