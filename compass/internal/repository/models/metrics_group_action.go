package models

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
