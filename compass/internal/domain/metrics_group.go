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

package domain

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type MetricsGroup struct {
	util.BaseModel
	Name        string               `json:"name"`
	Metrics     []Metric             `json:"metrics"`
	WorkspaceID uuid.UUID            `json:"-"`
	CircleID    uuid.UUID            `json:"circleId"`
	Actions     []MetricsGroupAction `json:"actions"`
	DeletedAt   *time.Time           `json:"-"`
}

type MetricGroupResume struct {
	util.BaseModel
	Name              string `json:"name"`
	Thresholds        int    `json:"thresholds"`
	ThresholdsReached int    `json:"thresholdsReached"`
	Metrics           int    `json:"metricsCount"`
	Status            string `json:"status"`
}

type MetricsGroupRepresentation struct {
	ID      uuid.UUID                          `json:"id"`
	Name    string                             `json:"name"`
	Metrics []Metric                           `json:"metrics"`
	Actions []GroupActionExecutionStatusResume `json:"actions"`
}

type MetricValues struct {
	ID       uuid.UUID   `json:"id"`
	Nickname string      `json:"metric"`
	Values   interface{} `json:"result"`
}

type MetricResult struct {
	ID       uuid.UUID `json:"id"`
	Nickname string    `json:"metric"`
	Result   float64   `json:"result"`
}
