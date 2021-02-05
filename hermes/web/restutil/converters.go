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
