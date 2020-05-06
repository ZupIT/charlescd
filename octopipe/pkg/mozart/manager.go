package mozart

import (
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/execution"
	"octopipe/pkg/git"
	"octopipe/pkg/template"
)

type MozartUseCases interface {
	Start(deployment *deployment.Deployment)
}

type MozartManager struct {
	executions    execution.ManagerUseCases
	template      template.ManagerUseCases
	git           git.ManagerUseCases
	deployer      deployer.ManagerUseCases
	cloudprovider cloudprovider.ManagerUseCases
}

func NewMozartManager(execution execution.ManagerUseCases,
	template template.ManagerUseCases,
	git git.ManagerUseCases,
	deployer deployer.ManagerUseCases,
	cloudprovider cloudprovider.ManagerUseCases,
) MozartUseCases {
	return &MozartManager{
		execution,
		template,
		git,
		deployer,
		cloudprovider,
	}
}

func (mozartManager *MozartManager) Start(deployment *deployment.Deployment) {
	pipeline := NewMozart(mozartManager, deployment)
	pipeline.Do(deployment)
}
