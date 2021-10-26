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

package subscription

import (
	"errors"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"hermes/internal/configuration"
	"hermes/internal/notification/message"
	"hermes/internal/notification/messageexecutionhistory"
	"hermes/internal/subscription"
	"hermes/web/restutil"
	"net/http"
	"strconv"
)

const (
	defaultPageValue = 0
	defaultSizeValue = 50
)

func Create(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := subscriptionMain.ParseSubscription(r.Body)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			restutil.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}
		request.CreatedBy = author

		if err := subscriptionMain.Validate(request); len(err.GetErrors()) > 0 {
			restutil.NewResponse(w, http.StatusBadRequest, err)
			return
		}

		subscriptionsCount, err := subscriptionMain.CountAllByExternalID(request.ExternalID)

		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		subscriptionLimit := configuration.GetConfigurationAsInt64("SUBSCRIPTION_REGISTER_LIMIT")
		if subscriptionLimit > 0 && subscriptionsCount >= subscriptionLimit {
			restutil.NewResponse(w, http.StatusUnprocessableEntity, "subscription limit reached to externalId")
			return
		}

		createdSubscription, err := subscriptionMain.Save(request)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusCreated, createdSubscription)
	}
}

func Update(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := subscriptionMain.ParseUpdate(r.Body)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		params := mux.Vars(r)
		subscriptionID, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		updatedResponse, err := subscriptionMain.Update(subscriptionID, request)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusOK, updatedResponse)
	}
}

func Delete(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionID, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			restutil.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}

		err := subscriptionMain.Delete(subscriptionID, author)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusNoContent, nil)
	}
}

func FindByID(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionID, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		result, err := subscriptionMain.FindByID(subscriptionID)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusOK, result)
	}
}

func History(messageMain message.UseCases, executionMain messageexecutionhistory.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionID, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		qp := map[string]string{
			"EventType":  r.URL.Query().Get("eventType"),
			"Status":     r.URL.Query().Get("eventStatus"),
			"EventField": r.URL.Query().Get("eventField"),
			"EventValue": r.URL.Query().Get("eventValue"),
		}

		page, atoiErr := strconv.Atoi(r.URL.Query().Get("page"))
		if atoiErr != nil {
			page = defaultPageValue
		}

		size, atoiErr := strconv.Atoi(r.URL.Query().Get("size"))
		if atoiErr != nil {
			size = defaultSizeValue
		}

		result, err := messageMain.FindAllBySubscriptionIDAndFilter(subscriptionID, qp, page, size)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		var executionIds []uuid.UUID
		for _, msg := range result {
			executionIds = append(executionIds, msg.ID)
		}

		response, err := executionMain.FindAllByExecutionID(executionIds)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		history := restutil.MessageAndExecutionToHistoryResponse(result, response)

		restutil.NewResponse(w, http.StatusOK, history)
	}
}

func Publish(messageMain message.UseCases, subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := messageMain.ParsePayload(r.Body)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		if vErr := messageMain.Validate(request); len(vErr.GetErrors()) > 0 {
			restutil.NewResponse(w, http.StatusBadRequest, vErr)
			return
		}

		subscriptions, sErr := subscriptionMain.FindAllByExternalIDAndEvent(request.ExternalID, request.EventType)
		if sErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, sErr)
			return
		}

		if len(subscriptions) <= 0 {
			restutil.NewResponse(w, http.StatusOK, "No subscription founded to this event")
			return
		}

		requestMessages, eventErr := restutil.SubscriptionToMessageRequest(subscriptions, request)
		if eventErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, eventErr)
			return
		}

		createdMessages, pErr := messageMain.Publish(requestMessages)
		if pErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, pErr)
			return
		}

		restutil.NewResponse(w, http.StatusCreated, createdMessages)
	}
}

func FindByExternalID(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		externalID, uuidErr := uuid.Parse(params["externalId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr.Error())
			return
		}

		result, err := subscriptionMain.FindAllByExternalID(externalID)

		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusOK, result)
	}
}

func HealthCheck(messageMain message.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionID, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		result, err := messageMain.FindMostRecent(subscriptionID)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusOK, result)
	}
}
