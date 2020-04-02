package mozart

import (
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
)

type Deploy struct {
}

func NewDeployeStep(
	pipeline *pipeline.Pipeline,
	deployer deployer.UseCases,
	executions execution.UseCases,
) *Deploy {
	return &Deploy{}
}

func (deploy *Deploy) Initialize() {
	return
}
