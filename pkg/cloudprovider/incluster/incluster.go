package incluster

import (
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
)

type InCluster struct{}

func NewInCluster() *InCluster {
	return &InCluster{}
}

func (inCluster *InCluster) GetClient() (dynamic.Interface, error) {
	config, err := inCluster.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(config)
}

func (inCluster *InCluster) getRestConfig() (*rest.Config, error) {
	return rest.InClusterConfig()
}
