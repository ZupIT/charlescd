package fake

import (
	"octopipe/pkg/deployer"
)

type DeployerManagerFake struct{}

func NewDeployerManagerFake() deployer.DeployerUseCases {
	return &DeployerManagerFake{}
}

func (deployer DeployerManagerFake) Do() error {
	panic("implement me")
}
