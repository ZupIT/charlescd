package outofcluster

import (
	"flag"
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
	if home := outOfCluster.homeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	return clientcmd.BuildConfigFromFlags("", *kubeconfig)
}

func (outOfCluster *OutOfCluster) homeDir() string {
	if h := os.Getenv("HOME"); h != "" {
		return h
	}
	return os.Getenv("USERPROFILE") // windows
}
