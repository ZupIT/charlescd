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

package datasource

import (
	"compass/internal/util"

	"github.com/google/uuid"
)

const (
	FunctionList   = "List"
	FunctionQuery  = "Query"
	FunctionResult = "Result"
)

type UseCases interface {
	GetMetrics()
	Validate()
}

type MetricFilter struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field"`
	Value    string    `json:"value"`
	Operator string    `json:"operator"`
}

type MetricList []string

type MetricResult struct {
	ID       uuid.UUID `json:"id"`
	Nickname string    `json:"metric"`
	Result   float64   `json:"result"`
}

type MetricValues struct {
	ID       uuid.UUID   `json:"id"`
	Nickname string      `json:"metric"`
	Values   interface{} `json:"result"`
}

type Value struct {
	Total  float64 `json:"total"`
	Period string  `json:"period"`
}
