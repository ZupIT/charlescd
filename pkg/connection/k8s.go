package connection

import (
	"flag"
	"os"
	"path/filepath"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	kubeconfigInCluster  = "IN_CLUSTER"
	kubeconfigOutCluster = "OUT_CLUSTER"
)

type K8sConnection struct {
	DynamicClientset dynamic.Interface
}

func NewK8sConnection(kubeconfigEnv string) (*K8sConnection, error) {
	var dynamicClientset dynamic.Interface
	var err error
	if kubeconfigEnv == kubeconfigInCluster {
		dynamicClientset, err = newDynamicK8sClientInCluster()
	} else {
		dynamicClientset, err = newDynamicK8sClientOutCluster()
	}

	if err != nil {
		return nil, err
	}

	return &K8sConnection{dynamicClientset}, nil
}

func newDynamicK8sClientOutCluster() (dynamic.Interface, error) {
	var kubeconfig *string
	if home := os.Getenv("HOME"); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}

	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		return nil, err
	}

	dynamicClient, err := dynamic.NewForConfig(config)
	if err != nil {
		return nil, err
	}

	return dynamicClient, nil
}

func newDynamicK8sClientInCluster() (dynamic.Interface, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		panic(err.Error())
	}

	dynamicClient, err := dynamic.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	return dynamicClient, nil
}
