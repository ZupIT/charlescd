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
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type MetricsGroupAction struct {
	util.BaseModel
	MetricsGroupID       uuid.UUID            `json:"metricsGroupId"`
	ActionID             uuid.UUID            `json:"actionId"`
	Nickname             string               `json:"nickname"`
	ExecutionParameters  json.RawMessage      `json:"executionParameters"`
	ActionsConfiguration ActionsConfiguration `json:"configuration"`
	DeletedAt            *time.Time           `json:"-"`
}

type ActionsConfiguration struct {
	util.BaseModel
	MetricsGroupActionID uuid.UUID `json:"-"`
	Repeatable           bool      `json:"repeatable"`
	NumberOfCycles       int16     `json:"numberOfCycles"`
}

type GroupActionExecutionStatusResume struct {
	Id         string     `json:"id"`
	Nickname   string     `json:"nickname"`
	ActionType string     `json:"actionType"`
	Status     string     `json:"status"`
	StartedAt  *time.Time `json:"triggeredAt"`
}
