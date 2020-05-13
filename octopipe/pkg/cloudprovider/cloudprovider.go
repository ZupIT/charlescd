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

type CloudproviderUseCases interface {
	GetClient() (dynamic.Interface, error)
}

type Cloudprovider struct {
	Provider string `json:"provider"`
	eks.EKSProvider
	generic.GenericProvider
}

func (cloudproviderManager *CloudproviderManager) NewCloudProvider(provider *Cloudprovider) CloudproviderUseCases {
	switch provider.Provider {
	case GenericCloudProviderType:
		genericProvider := &generic.GenericProvider{
			Host:              provider.Host,
			CAData:            provider.CAData,
			ClientCertificate: provider.ClientCertificate,
			ClientKey:         provider.ClientKey,
		}
		return generic.NewGenericProvider(genericProvider)
	case EKSCloudProviderType:
		eksProvider := &eks.EKSProvider{
			AWSID:          provider.AWSID,
			AWSSecret:      provider.AWSSecret,
			AWSRegion:      provider.AWSRegion,
			AWSClusterName: provider.AWSClusterName,
		}
		return eks.NewEKSProvider(eksProvider)
	default:
		return provider.newDefaultConfig()
	}
}

func (provider *Cloudprovider) newDefaultConfig() CloudproviderUseCases {
	if config := os.Getenv("KUBECONFIG"); config == OutOfClusterType {
		return outofcluster.NewOutOfCluster()
	} else {
		return incluster.NewInCluster()
	}
}
