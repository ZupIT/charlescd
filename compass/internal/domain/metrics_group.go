package domain

import (
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
	"time"
)

type MetricsGroup struct {
	util.BaseModel
	Name        string                                  `json:"name"`
	Metrics     []metric.Metric                         `json:"metrics"`
	WorkspaceID uuid.UUID                               `json:"-"`
	CircleID    uuid.UUID                               `json:"circleId"`
	Actions     []metricsgroupaction.MetricsGroupAction `json:"actions"`
	DeletedAt   *time.Time                              `json:"-"`
}

type MetricGroupResume struct {
	util.BaseModel
	Name              string `json:"name"`
	Thresholds        int    `json:"thresholds"`
	ThresholdsReached int    `json:"thresholdsReached"`
	Metrics           int    `json:"metricsCount"`
	Status            string `json:"status"`
}
