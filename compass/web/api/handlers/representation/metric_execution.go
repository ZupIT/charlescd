package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
)

type MetricExecutionRequest struct {
	LastValue float64 `json:"lastValue"`
	Status    string  `json:"status"`
}

func (metricExecutionRequest MetricExecutionRequest) MetricExecutionRequestToDomain() domain.MetricExecution {
	return domain.MetricExecution{
		LastValue: metricExecutionRequest.LastValue,
		Status:    metricExecutionRequest.Status,
	}
}
