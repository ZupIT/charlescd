package models

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type ActionsExecutions struct {
	util.BaseModel
	GroupActionId uuid.UUID  `json:"groupActionId"`
	ExecutionLog  string     `json:"executionLog"`
	Status        string     `json:"status"`
	StartedAt     *time.Time `json:"startedAt"`
	FinishedAt    *time.Time `json:"finishedAt"`
}
