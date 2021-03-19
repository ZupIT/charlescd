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

package restutil

import (
	"encoding/json"
	"errors"
	"hermes/internal/notification/payloads"
	"hermes/internal/subscription"
	"strconv"
)

func MessageAndExecutionToHistoryResponse(messages []payloads.FullMessageResponse, executions []payloads.FullMessageExecutionResponse) []payloads.HistoryResponse {
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

func SubscriptionToMessageRequest(subscriptions []subscription.ExternalIdResponse, request payloads.PayloadRequest) ([]payloads.Request, error) {
	var messages []payloads.Request

	unEvent, err := strconv.Unquote(string(request.Event))
	if err != nil {
		return nil, errors.New("cannot parse this event: " + err.Error())
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
