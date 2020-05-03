package mozart

import (
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
	"octopipe/pkg/git"
	"octopipe/pkg/template"
)

type UseCases interface {
	Start(deployment *deployment.Deployment)
}

type Mozart struct {
	executions    execution.ManagerUseCases
	template      template.ManagerUseCases
	git           git.ManagerUseCases
	deployer      deployer.ManagerUseCases
	cloudprovider cloudprovider.ManagerUseCases
}

func NewMozart(execution execution.ManagerUseCases,
	template template.ManagerUseCases,
	git git.ManagerUseCases,
	deployer deployer.ManagerUseCases,
	cloudprovider cloudprovider.ManagerUseCases,
) *Mozart {
	return &Mozart{
		execution,
		template,
		git,
		deployer,
		cloudprovider,
	}
}

func (mozart *Mozart) Start(deployment *deployment.Deployment) {
	pipeline := NewMozartPipeline(mozart, deployment)
	pipeline.Do(deployment)
}
