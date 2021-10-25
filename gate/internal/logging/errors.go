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

package logging

import (
	"strconv"
	"time"

	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"

	"github.com/google/uuid"
)

type CustomError struct {
	ID         uuid.UUID         `json:"id"`
	Message    string            `json:"message"`
	Detail     string            `json:"detail"`
	Operations []string          `json:"-"`
	Type       string            `json:"type"`
	Timestamp  string            `json:"timestamp"`
	Meta       map[string]string `json:"-"`
}

func (customError CustomError) Error() string {
	return customError.Detail
}

func WithOperation(err error, operation string) error {
	customErr := err.(*CustomError)
	customErr.Operations = append(customErr.Operations, operation)

	return customErr
}

func WithMeta(err error, key, value string) error {
	customErr := err.(*CustomError)
	customErr.Meta[key] = value

	return customErr
}

func Unwrap(err error) CustomError {
	customErr, ok := err.(*CustomError)
	if !ok {
		customErr = NewError("", err, customErr.Type, nil).(*CustomError)
	}

	return *customErr
}

func GetErrorType(err error) string {
	customError := Unwrap(err)
	return customError.Type
}

func GetErrorDetails(err error) string {
	customError := Unwrap(err)
	return customError.Detail
}

func NewError(message string, err error, typeError string, meta map[string]string, operations ...string) error {
	return &CustomError{
		ID:         uuid.New(),
		Message:    message,
		Meta:       meta,
		Detail:     err.Error(),
		Operations: operations,
		Type:       typeError,
		Timestamp:  strconv.FormatInt(time.Now().Unix(), 10),
	}
}

func NewValidationError(validationError error, uniTranslator *ut.UniversalTranslator) error {
	errors := validationError.(validator.ValidationErrors)
	translator, _ := uniTranslator.GetTranslator("en")
	meta := make(map[string]string)

	for _, validErr := range errors {
		meta[validErr.Namespace()] = validErr.Translate(translator)
	}

	return &CustomError{
		ID:        uuid.New(),
		Message:   "Invalid Inputs",
		Meta:      meta,
		Detail:    errors.Error(),
		Timestamp: strconv.FormatInt(time.Now().Unix(), 10),
	}
}

const (
	NotFoundError     = "NotFoundError"
	InternalError     = "InternalError"
	IllegalParamError = "IllegalParamError"
	ParseError        = "ParseError"
	BusinessError     = "BusinessError"
	ForbiddenError    = "ForbiddenError"
)
