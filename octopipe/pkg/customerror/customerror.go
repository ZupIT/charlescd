/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package customerror

import (
	"fmt"
	"runtime"
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type Customerror struct {
	ID         uuid.UUID
	Title      string            `json:"title"`
	Detail     string            `json:"detail"`
	Operations []string          `json:"operations"`
	Meta       map[string]string `json:"meta"`
}

func (err Customerror) Error() string {
	return err.Detail
}

func WithLogFields(err error, operations ...string) logrus.Fields {
	customerr, ok := err.(Customerror)
	if !ok {
		customerr = New("Internal error", err.Error(), nil, operations...)
	}

	return logrus.Fields{
		"id":         customerr.ID.String(),
		"title":      customerr.Title,
		"detail":     customerr.Detail,
		"operations": customerr.Operations,
		"meta":       customerr.Meta,
	}
}

func WithOperation(err error, operation ...string) error {
	customerr, ok := err.(*Customerror)
	if !ok {
		return New("Internal error", err.Error(), nil, operation...)
	}

	customerr.Operations = append(customerr.Operations, trace())
	return customerr
}

func WithMeta(err error, meta map[string]string, operations ...string) error {
	customerr, ok := err.(*Customerror)
	if !ok {
		return New("Internal error", err.Error(), meta, operations...)
	}

	for k, v := range meta {
		customerr.Meta[k] = v
	}

	return customerr
}

func New(title string, detail string, meta map[string]string, operations ...string) Customerror {
	var newMeta map[string]string
	if meta == nil {
		newMeta = map[string]string{
			"timestamp": time.Now().String(),
		}
	} else {
		newMeta = meta
		newMeta["timestamp"] = time.Now().String()
	}

	return Customerror{
		ID:         uuid.New(),
		Title:      title,
		Detail:     detail,
		Meta:       newMeta,
		Operations: []string{trace()},
	}
}

func trace() string {
	pc := make([]uintptr, 10)
	runtime.Callers(3, pc)
	f := runtime.FuncForPC(pc[1])
	file, line := f.FileLine(pc[1])
	return fmt.Sprintf("%s:%d %s", file, line, f.Name())
}
