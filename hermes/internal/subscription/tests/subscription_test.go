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
			ExternalId: uuid.New(),
			Url: "localhost:8080",
			Description: "My Webhook",
			ApiKey: "",
			Events: []string{"DEPLOY"},
			CreatedBy: "charles@email.com",
		}

		expected := 0
		err := main.Validate(request)
		if len(err.GetErrors()) > expected {
			t.Errorf("result '%d', expected '%d'", len(err.GetErrors()), expected)
		}

	})

	t.Run("Validate with empty url", func(t *testing.T) {
		request := subscription.Request{
			ExternalId: uuid.New(),
			Url: "",
			Description: "My Webhook",
			ApiKey: "",
			Events: []string{"DEPLOY"},
			CreatedBy: "charles@email.com",
		}

		err := main.Validate(request)
		verifyResult(t, "Url is required", err.GetErrors()[0].Error().Detail)

	})

	t.Run("Validate with empty description", func(t *testing.T) {
		request := subscription.Request{
			ExternalId: uuid.New(),
			Url: "localhost:8080",
			Description: "",
			ApiKey: "",
			Events: []string{"DEPLOY"},
			CreatedBy: "charles@email.com",
		}

		err := main.Validate(request)
		verifyResult(t, "Description is required", err.GetErrors()[0].Error().Detail)

	})

	t.Run("Validate with empty events", func(t *testing.T) {
		request := subscription.Request{
			ExternalId: uuid.New(),
			Url: "localhost:8080",
			Description: "My Webhook",
			ApiKey: "",
			Events: nil,
			CreatedBy: "charles@email.com",
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

func TestUpdateParseSubscription (t *testing.T) {

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