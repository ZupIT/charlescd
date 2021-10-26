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
	"database/sql"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/subscription"
	"log"
	"net/http"
	"time"
)

type API struct {
	// Dependencies
	subscriptionMain subscription.UseCases
	messageMain      message.UseCases
	executionMain    messageexecutionhistory.UseCases
}

type Readiness struct {
	Database     string
	MessageQueue string
}

func NewAPI(subscriptionMain subscription.UseCases, messageMain message.UseCases, executionMain messageexecutionhistory.UseCases, db *sql.DB) *mux.Router {
	api := API{
		subscriptionMain: subscriptionMain,
		messageMain:      messageMain,
		executionMain:    executionMain,
	}

	router := mux.NewRouter()
	api.health(router)
	api.readiness(router, db)

	s := router.PathPrefix("/api").Subrouter()

	s.Use(LoggingMiddleware)
	api.newV1Api(s)

	return router
}

func (api *API) health(r *mux.Router) {
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte(":)"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			logrus.Error(err)
		}
	})
}

func (api *API) readiness(r *mux.Router, db *sql.DB) {
	r.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
		ready := Readiness{
			Database:     "ALIVE",
			MessageQueue: "ALIVE",
		}

		if db.Ping() != nil {
			ready.Database = "FAILED"
		}

		response, err := json.Marshal(ready)
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"err": err,
			}).Warnln()
		}

		_, err = w.Write(response)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			logrus.Error(err)
		}
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
