package mozart

import (
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
)

type UseCases interface {
	Start(deployment *deployment.Deployment)
}

type Mozart struct {
	executions execution.UseCases
}

func NewMozart(execution execution.UseCases) *Mozart {
	return &Mozart{execution}
}

func (mozart *Mozart) Start(deployment *deployment.Deployment) {
	pipeline := NewMozartPipeline(mozart, deployment)
	pipeline.Do(deployment)
}
