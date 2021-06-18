package models

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
