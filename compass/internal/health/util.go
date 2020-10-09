package health

const (
	REQUESTS_BY_CIRCLE         = "req/s"
	REQUESTS_ERRORS_BY_CIRCLE  = "%"
	REQUESTS_LATENCY_BY_CIRCLE = "ms"
)

type DeploymentInCircle struct {
	Id               string  `json:"id"`
	Name             string  `json:"name"`
	ErrorThreshold   float64 `json:"errorThreshold"`
	LatencyThreshold float64 `json:"latencyThreshold"`
	ModuleId         string  `json:"moduleId"`
	ModuleName       string  `json:"moduleName"`
}
