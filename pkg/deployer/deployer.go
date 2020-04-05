package deployer

import "errors"

const (
	DeployAction   = "DEPLOY"
	UndeployAction = "UNDEPLOY"
)

type Deployer interface {
	Do(manifest map[string]interface{})
}

type DeployerManager struct {
	K8sConnection interface{}
}

func NewDeployerManager() {

}

func NewDeployer(action string) (Deployer, error) {
	switch action {
	case DeployAction:
		return NewDeploy(), nil
	case UndeployAction:
		return NewUndeploy(), nil
	default:
		return nil, errors.New("Deployer action not found!")
	}
}
