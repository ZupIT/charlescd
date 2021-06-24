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

package models

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
)

type Metric struct {
	util.BaseModel
	MetricsGroupID  uuid.UUID                 `json:"metricGroupId"`
	DataSourceID    uuid.UUID                 `json:"dataSourceId"`
	Nickname        string                    `json:"nickname"`
	Query           string                    `json:"query"`
	Metric          string                    `json:"metric"`
	Filters         []datasource.MetricFilter `json:"filters"`
	GroupBy         []MetricGroupBy           `json:"groupBy"`
	Condition       string                    `json:"condition"`
	Threshold       float64                   `json:"threshold"`
	CircleID        uuid.UUID                 `json:"circleId"`
	MetricExecution MetricExecution           `json:"execution"`
}

type MetricGroupBy struct {
	util.BaseModel
	MetricID uuid.UUID `json:"-"`
	Field    string    `json:"field"`
}
