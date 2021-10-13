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
	"fmt"
	"github.com/gorilla/mux"
	"hermes/web/api/subscription"
)

func (api *API) newV1Api(s *mux.Router) {
	r := s.PathPrefix("/v1").Subrouter()
	{
		path := "/subscriptions"
		r.HandleFunc(path, subscription.Create(api.subscriptionMain)).Methods("POST")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}", path), subscription.Update(api.subscriptionMain)).Methods("PUT")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}", path), subscription.Delete(api.subscriptionMain)).Methods("DELETE")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}", path), subscription.FindByID(api.subscriptionMain)).Methods("GET")
		r.HandleFunc(fmt.Sprintf("%s/publish", path), subscription.Publish(api.messageMain, api.subscriptionMain)).Methods("POST")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}/history", path), subscription.History(api.messageMain, api.executionMain)).Methods("GET")
		r.HandleFunc(fmt.Sprintf("%s/external-id/{externalId}", path), subscription.FindByExternalID(api.subscriptionMain)).Methods("GET")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}/health-check", path), subscription.HealthCheck(api.messageMain)).Methods("GET")
	}
}
