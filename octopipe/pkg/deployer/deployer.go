package deployer

import (
	"errors"
	"octopipe/pkg/cloudprovider"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

const (
	DeployAction   = "DEPLOY"
	UndeployAction = "UNDEPLOY"
)

type Resource struct {
	Action      string
	ForceUpdate bool
	Manifest    *unstructured.Unstructured
	Rollout     string
	Type        []string
	Config      cloudprovider.CloudproviderUseCases
	Namespace   string
}

type DeployerUseCases interface {
	Do() error
}

func (deployerManager *DeployerManager) NewDeployer(resource *Resource) (DeployerUseCases, error) {
	switch resource.Action {
	case DeployAction:
		return NewDeploy(resource), nil
	case UndeployAction:
		return NewUndeploy(resource), nil
	default:
		return nil, errors.New("Deployer action not found!")
	}
}
