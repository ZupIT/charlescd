package cloudprovider

import (
	"k8s.io/client-go/dynamic"
	"octopipe/pkg/cloudprovider/eks"
	"octopipe/pkg/cloudprovider/generic"
	"octopipe/pkg/cloudprovider/incluster"
)

const (
	GenericCloudProviderType = "GENERIC"
	EKSCloudProviderType     = "EKS"
)

type UseCases interface {
	Connect() (dynamic.Interface, error)
}

type Provider struct {
	Provider string `json:"provider"`
	eks.EKSProvider
	generic.GenericProvider
}

func NewCloudProvider(provider *Provider) UseCases {
	switch provider.Provider {
	case GenericCloudProviderType:
		return generic.NewGenericProvider()
	case EKSCloudProviderType:
		return eks.NewEKSProvider()
	default:
		return incluster.NewInCluster()
	}
}
