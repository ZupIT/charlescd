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

package subscription

import (
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"hermes/internal/message/message"
	"hermes/internal/message/messageexecutionhistory"
	"hermes/internal/message/payloads"
	"hermes/internal/subscription"
	"hermes/web/restutil"
	"net/http"
	"strconv"
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
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		createdSubscription, err := subscriptionMain.Update(subscriptionId, request)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusOK, createdSubscription)
	}
}

func Delete(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			restutil.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}

		err := subscriptionMain.Delete(subscriptionId, author)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		restutil.NewResponse(w, http.StatusNoContent, nil)
	}
}

func FindById(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		result, err := subscriptionMain.FindById(subscriptionId)
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
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		qp := map[string]string{
			"EventType": r.URL.Query().Get("eventyType"),
			"Status": r.URL.Query().Get("status"),
			"EventField": r.URL.Query().Get("eventField"),
			"EventValue": r.URL.Query().Get("eventValue"),
		}

		result, err := messageMain.FindAllBySubscriptionId(subscriptionId, qp)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		var executionIds []uuid.UUID
		for _, msg := range result {
			executionIds = append(executionIds, msg.Id)
		}

		response, err := executionMain.FindAllByExecutionId(executionIds)
		if err != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		history := mapMessages(result, response)

		restutil.NewResponse(w, http.StatusOK, history)
	}
}

func mapMessages(messages []payloads.FullMessageResponse, executions []payloads.FullMessageExecutionResponse) []payloads.HistoryResponse {
	var response []payloads.HistoryResponse

	for _, messageResponse := range messages {
		p := payloads.HistoryResponse{
			FullMessageResponse: payloads.FullMessageResponse{
				Id:             messageResponse.Id,
				EventType:      messageResponse.EventType,
				Event:          messageResponse.Event,
				LastStatus:     messageResponse.LastStatus,
				SubscriptionId: messageResponse.SubscriptionId,
			},
		}

		var execs []payloads.FullMessageExecutionResponse
		for _, executionResponse := range executions {
			if messageResponse.Id == executionResponse.ExecutionId {
				execs = append(execs, executionResponse)
				p.Executions = execs
			}

		}
		response = append(response, p)

	}

	return response
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

		subscriptions, sErr := subscriptionMain.FindAllByExternalIdAndEvent(request.ExternalId, request.EventType)
		if sErr != nil {
			restutil.NewResponse(w, http.StatusInternalServerError, sErr)
			return
		}

		requestMessages, eventErr := subscriptionToMessageRequest(subscriptions, request)
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

func subscriptionToMessageRequest(subscriptions []subscription.ExternalIdResponse, request payloads.PayloadRequest) ([]payloads.Request, error) {
	var messages []payloads.Request

	unEvent, err := strconv.Unquote(string(request.Event))
	if err != nil {
		return nil, errors.New("cannot parse this event: "+ err.Error())
	}

	rawEvent := json.RawMessage(unEvent)

	for _, s := range subscriptions {
		msg := payloads.Request{
			SubscriptionId: s.Id,
			EventType:      request.EventType,
			Event:          rawEvent,
		}
		messages = append(messages, msg)
	}

	return messages, nil
}
