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

package tests

import (
	"bytes"
	"github.com/google/uuid"
	"hermes/internal/notification/message"
	"hermes/internal/notification/payloads"
	"io/ioutil"
	"testing"
)

func TestMessageValidate(t *testing.T) {

	main := message.NewMain(nil, nil, nil)
	event := []byte(`{"type":"DEPLOY","status":"SUCCESS","workspaceId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e"}`)

	verifyResult := func(t *testing.T, result, expected string) {
		t.Helper()
		if result != expected {
			t.Errorf("result '%s', expected '%s'", result, expected)
		}
	}

	t.Run("Validate without error", func(t *testing.T) {
		eventMessage := payloads.PayloadRequest{
			ExternalID: uuid.New(),
			EventType:  "DEPLOY",
			Event:      event,
		}

		expected := 0
		err := main.Validate(eventMessage)
		if len(err.GetErrors()) > expected {
			t.Errorf("result '%d', expected '%d'", len(err.GetErrors()), expected)
		}

	})

	t.Run("Validate with invalid uuid", func(t *testing.T) {
		eventMessage := payloads.PayloadRequest{
			ExternalID: uuid.Nil,
			EventType:  "DEPLOY",
			Event:      event,
		}

		err := main.Validate(eventMessage)
		verifyResult(t, "ExternalID is required", err.GetErrors()[0].Error().Detail)
	})

	t.Run("Validate with empty event type", func(t *testing.T) {
		eventMessage := payloads.PayloadRequest{
			ExternalID: uuid.New(),
			EventType:  "",
			Event:      event,
		}

		err := main.Validate(eventMessage)
		verifyResult(t, "EventType is required", err.GetErrors()[0].Error().Detail)
	})

	t.Run("Validate with empty event", func(t *testing.T) {
		eventMessage := payloads.PayloadRequest{
			ExternalID: uuid.New(),
			EventType:  "DEPLOY",
			Event:      nil,
		}

		err := main.Validate(eventMessage)
		verifyResult(t, "Event is required", err.GetErrors()[0].Error().Detail)
	})

}

func TestMessageParsePayload(t *testing.T) {

	main := message.NewMain(nil, nil, nil)

	verifyResult := func(t *testing.T, result, expected string) {
		t.Helper()
		if result != expected {
			t.Errorf("result '%s', expected '%s'", result, expected)
		}
	}

	t.Run("Validate without error", func(t *testing.T) {
		request := []byte(`{"externalId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e","eventType":"DEPLOY","event":"{}"}`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParsePayload(rCloser)
		if err != nil {
			t.Errorf("result '%s', expected '%s'", err.Error().Detail, "")
		}
	})

	t.Run("Parse error unexpected EOF", func(t *testing.T) {
		request := []byte(`{"externalId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e","eventType":"DEPLOY","event":"{}"`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParsePayload(rCloser)
		verifyResult(t, err.Error().Detail, "unexpected EOF")
	})

	t.Run("Parse error to PayloadRequest", func(t *testing.T) {
		request := []byte(`"externalId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e","eventType":"DEPLOY","event":"{}"`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParsePayload(rCloser)
		verifyResult(t, err.Error().Detail, "json: cannot unmarshal string into Go value of type payloads.PayloadRequest")
	})
}
