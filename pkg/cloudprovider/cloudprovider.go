package cloudprovider

import (
	"octopipe/pkg/cloudprovider/eks"
	"octopipe/pkg/cloudprovider/generic"
	"octopipe/pkg/cloudprovider/incluster"
	"octopipe/pkg/cloudprovider/outofcluster"
	"os"

	"k8s.io/client-go/dynamic"
)

const (
	GenericCloudProviderType = "GENERIC"
	EKSCloudProviderType     = "EKS"
	OutOfClusterType         = "OUT_OF_CLUSTER"
)

type UseCases interface {
	GetClient() (dynamic.Interface, error)
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
		return provider.newDefaultConfig()
	}
}

func (provider *Provider) newDefaultConfig() UseCases {
	if config := os.Getenv("KUBECONFIG"); config == OutOfClusterType {
		return outofcluster.NewOutOfCluster()
	} else {
		return incluster.NewInCluster()
	}
}
