package router

import "hermes/pkg/errors"

type ErrorLink map[string]string

type ApiError struct {
	errors.SimpleError
	Links  ErrorLink `json:"links"`
	Status string    `json:"status"`
	Code   string    `json:"code"`
}

type ApiErrors struct {
	Errors []ApiError `json:"errors"`
}

func NewApiErrors() *ApiErrors {
	return &ApiErrors{}
}

func (apiErrors *ApiErrors) ToApiErrors(status string, link string, ers ...errors.Error) *ApiErrors {
	for _, err := range ers {
		apiError := ApiError{
			Links: ErrorLink{
				"about": link,
			},
			Status:      status,
			SimpleError: err.Error(),
		}

		apiErrors.Errors = append(apiErrors.Errors, apiError)
	}

	return apiErrors
}