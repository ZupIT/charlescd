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
	"hermes/internal/subscription"
	"io/ioutil"

	"testing"
)

func TestSubscriptionValidate(t *testing.T) {

	main := subscription.NewMain(nil)

	verifyResult := func(t *testing.T, result, expected string) {
		t.Helper()
		if result != expected {
			t.Errorf("result '%s', expected '%s'", result, expected)
		}
	}

	t.Run("Validate without error", func(t *testing.T) {
		request := subscription.Request{
			ExternalID:  uuid.New(),
			URL:         "localhost:8080",
			Description: "My Webhook",
			APIKey:      "",
			Events:      []string{"DEPLOY"},
			CreatedBy:   "charles@email.com",
		}

		expected := 0
		err := main.Validate(request)
		if len(err.GetErrors()) > expected {
			t.Errorf("result '%d', expected '%d'", len(err.GetErrors()), expected)
		}

	})

	t.Run("Validate with empty url", func(t *testing.T) {
		request := subscription.Request{
			ExternalID:  uuid.New(),
			URL:         "",
			Description: "My Webhook",
			APIKey:      "",
			Events:      []string{"DEPLOY"},
			CreatedBy:   "charles@email.com",
		}

		err := main.Validate(request)
		verifyResult(t, "URL is required", err.GetErrors()[0].Error().Detail)

	})

	t.Run("Validate with empty description", func(t *testing.T) {
		request := subscription.Request{
			ExternalID:  uuid.New(),
			URL:         "localhost:8080",
			Description: "",
			APIKey:      "",
			Events:      []string{"DEPLOY"},
			CreatedBy:   "charles@email.com",
		}

		err := main.Validate(request)
		verifyResult(t, "Description is required", err.GetErrors()[0].Error().Detail)

	})

	t.Run("Validate with empty events", func(t *testing.T) {
		request := subscription.Request{
			ExternalID:  uuid.New(),
			URL:         "localhost:8080",
			Description: "My Webhook",
			APIKey:      "",
			Events:      nil,
			CreatedBy:   "charles@email.com",
		}

		err := main.Validate(request)
		verifyResult(t, "Events are required", err.GetErrors()[0].Error().Detail)

	})

}

func TestUpdateParseUpdate(t *testing.T) {

	main := subscription.NewMain(nil)

	verifyResult := func(t *testing.T, result, expected string) {
		t.Helper()
		if result != expected {
			t.Errorf("result '%s', expected '%s'", result, expected)
		}
	}

	t.Run("Validate without error", func(t *testing.T) {
		request := []byte(`{ "events": ["DEPLOY", "UNDEPLOY"]}`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))
		_, err := main.ParseUpdate(rCloser)
		if err != nil {
			t.Errorf("result '%s', expected '%s'", err.Error().Detail, "")
		}
	})

	t.Run("Parse error unexpected EOF", func(t *testing.T) {
		request := []byte(`{ "events": ["DEPLOY", "UNDEPLOY"]`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParseUpdate(rCloser)
		verifyResult(t, err.Error().Detail, "unexpected EOF")
	})

	t.Run("Parse error to UpdateRequest", func(t *testing.T) {
		request := []byte(`"events": ["DEPLOY", "UNDEPLOY"]}`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParseUpdate(rCloser)
		verifyResult(t, err.Error().Detail, "json: cannot unmarshal string into Go value of type subscription.UpdateRequest")
	})
}

func TestUpdateParseSubscription(t *testing.T) {

	main := subscription.NewMain(nil)

	verifyResult := func(t *testing.T, result, expected string) {
		t.Helper()
		if result != expected {
			t.Errorf("result '%s', expected '%s'", result, expected)
		}
	}

	t.Run("Validate without error", func(t *testing.T) {
		request := []byte(`{"externalId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e","url":"localhost:080","description":"My Webhook", "events": ["DEPLOY", "UNDEPLOY"]}}`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))
		_, err := main.ParseUpdate(rCloser)
		if err != nil {
			t.Errorf("result '%s', expected '%s'", err.Error().Detail, "")
		}
	})

	t.Run("Parse error unexpected EOF", func(t *testing.T) {
		request := []byte(`{"externalId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e","url":"localhost:080","description":"My Webhook", "events": ["DEPLOY", "UNDEPLOY"]`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParseSubscription(rCloser)
		verifyResult(t, err.Error().Detail, "unexpected EOF")
	})

	t.Run("Parse error to Request", func(t *testing.T) {
		request := []byte(`"externalId":"06666a99-7800-4c83-af2c-a1a1d5e1bb2e","url":"localhost:080","description":"My Webhook", "events": ["DEPLOY", "UNDEPLOY"]`)
		rCloser := ioutil.NopCloser(bytes.NewReader(request))

		_, err := main.ParseSubscription(rCloser)
		verifyResult(t, err.Error().Detail, "json: cannot unmarshal string into Go value of type subscription.Request")
	})
}
