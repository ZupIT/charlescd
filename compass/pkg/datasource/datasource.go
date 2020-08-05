package datasource

type UseCases interface {
	GetMetrics()
	Validate()
}
