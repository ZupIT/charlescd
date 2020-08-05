/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

func (cloudproviderManager CloudproviderMain) NewCloudProvider(provider Cloudprovider) CloudproviderUseCases {
	switch provider.Provider {
	case GenericCloudProviderType:
		genericProvider := generic.GenericProvider{
			Host:              provider.Host,
			CAData:            provider.CAData,
			ClientCertificate: provider.ClientCertificate,
			ClientKey:         provider.ClientKey,
		}
		return generic.NewGenericProvider(genericProvider)
	case EKSCloudProviderType:
		eksProvider := eks.EKSProvider{
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

func (provider Cloudprovider) newDefaultConfig() CloudproviderUseCases {
	if config := os.Getenv("KUBECONFIG"); config == OutOfClusterType {
		return outofcluster.NewOutOfCluster()
	}
	return incluster.NewInCluster()
}
