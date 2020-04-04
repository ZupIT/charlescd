package mozart

import (
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
)

type UseCases interface {
	Start(deployment *deployment.Deployment)
}

type Mozart struct {
	deployer   deployer.UseCases
	executions execution.UseCases
}

func NewMozart(deployer deployer.UseCases, execution execution.UseCases) *Mozart {
	return &Mozart{deployer, execution}
}

func (mozart *Mozart) Start(deployment *deployment.Deployment) {
	pipeline := NewPipeline(mozart, deployment)
	pipeline.Do()
}
