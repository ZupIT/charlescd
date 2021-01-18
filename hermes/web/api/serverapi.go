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
