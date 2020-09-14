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
