package deployer

type ManagerUseCases interface {
	NewDeployer(resource *Resource) (DeployerUseCases, error)
}

type DeployerManager struct{}

func NewDeployerManager() ManagerUseCases {
	return &DeployerManager{}
}
