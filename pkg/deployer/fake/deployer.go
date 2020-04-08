package fake

import (
	"octopipe/pkg/deployer"
)

type DeployerManagerFake struct{}

func NewDeployerManagerFake() deployer.UseCases {
	return &DeployerManagerFake{}
}

func (deployer DeployerManagerFake) Do() error {
	panic("implement me")
}
