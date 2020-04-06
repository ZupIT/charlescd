package incluster

import "k8s.io/client-go/dynamic"

type InCluster struct{}

func NewInCluster() *InCluster {
	return &InCluster{}
}

func (inCluster *InCluster) Connect() (dynamic.Interface, error) {

}
