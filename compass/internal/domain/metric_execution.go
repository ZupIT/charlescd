package domain

import (
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
)

type MetricExecution struct {
	util.BaseModel `json:"-"`
	MetricID       uuid.UUID `json:"-"`
	LastValue      float64   `json:"lastValue"`
	Status         string    `json:"status"`
}
