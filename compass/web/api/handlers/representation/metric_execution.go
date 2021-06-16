package representation

type MetricExecution struct {
	LastValue float64 `json:"lastValue"`
	Status    string  `json:"status"`
}
