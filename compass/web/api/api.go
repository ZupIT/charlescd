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

package api

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"net/http"

	"github.com/google/uuid"
)

type BaseEntityRepresentation struct {
	ID uuid.UUID `json:"id"`
}

type RestError struct {
	Message string `json:"message"`
}

type RestValidateError struct {
	Message string           `json:"message"`
	Errors  []util.ErrorUtil `json:"errors"`
}

func NewRestError(w http.ResponseWriter, status int, errs []error) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)

	var restErrors []RestError
	for _, err := range errs {
		restErrors = append(restErrors, RestError{Message: err.Error()})
	}
	_ = json.NewEncoder(w).Encode(restErrors)
}

func NewRestValidateError(w http.ResponseWriter, status int, errs []util.ErrorUtil, msg string) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)

	var restErrors = RestValidateError{
		Message: msg,
		Errors:  errs,
	}

	_ = json.NewEncoder(w).Encode(restErrors)
}

func NewRestSuccess(w http.ResponseWriter, status int, response interface{}) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(response)
}
