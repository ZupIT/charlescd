package cloudprovider

type ManagerUseCases interface {
	NewCloudProvider(provider *Cloudprovider) CloudproviderUseCases
}

type CloudproviderManager struct{}

func NewCloudproviderManager() ManagerUseCases {
	return &CloudproviderManager{}
}
