package datasource

import (
	"compass/datasource"
)

type UseCases interface {
	GetMetrics()
	Validate()
}

type Configuration datasource.DataSource

type MetricList struct {
	Data []string `json:"data"`
}
