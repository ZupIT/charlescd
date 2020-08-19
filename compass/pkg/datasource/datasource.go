package datasource

const (
	FunctionList   = "List"
	FunctionQuery  = "Query"
	FunctionResult = "Result"
)

type UseCases interface {
	GetMetrics()
	Validate()
}

type MetricList []string

type MetricResult struct {
	Metric string  `json:"metric"`
	Result float64 `json:"result"`
}

type MetricValues struct {
	Metric string      `json:"metric"`
	Values interface{} `json:"result"`
}
