package datasource

type UseCases interface {
	GetMetrics()
	Validate()
}

type MetricList []string
