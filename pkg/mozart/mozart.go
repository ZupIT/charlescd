package mozart

import (
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
)

type Step interface {
	Initialize()
}

type Steps struct {
	steps []Step
}

type Mozart struct {
	deployer   deployer.UseCases
	executions execution.UseCases
	steps      []Step
}

var steps = []Step{}

func NewMozart(deployer deployer.UseCases, execution execution.UseCases) *Mozart {
	return &Mozart{deployer, execution, steps}
}

func (mozart *Mozart) Start(pipeline *pipeline.Pipeline) {

}
