package outofcluster

import (
	"os"
	"path/filepath"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

type OutOfCluster struct{}

func NewOutOfCluster() *OutOfCluster {
	return &OutOfCluster{}
}

func (outOfCluster *OutOfCluster) GetClient() (dynamic.Interface, error) {
	config, err := outOfCluster.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(config)
}

func (outOfCluster *OutOfCluster) getRestConfig() (*rest.Config, error) {
	var kubeconfig *string
	if home := os.Getenv("HOME"); home != "" {
		kubeConfigPath := filepath.Join(home, ".kube", "config")
		kubeconfig = &kubeConfigPath
	}

	return clientcmd.BuildConfigFromFlags("", *kubeconfig)
}
