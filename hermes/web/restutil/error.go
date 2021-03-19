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
