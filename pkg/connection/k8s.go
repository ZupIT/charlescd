package connection

import (
	"flag"
	"os"
	"path/filepath"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	kubeconfigInCluster  = "IN_CLUSTER"
	kubeconfigOutCluster = "OUT_CLUSTER"
)

type K8sConnection struct {
	DynamicClientset dynamic.Interface
	DefaultClientset *kubernetes.Clientset
}

func NewK8sConnection(kubeconfigEnv string) (*K8sConnection, error) {
	var dynamicClientset dynamic.Interface
	var defaultClientset *kubernetes.Clientset
	var err error
	if kubeconfigEnv == kubeconfigInCluster {
		dynamicClientset, defaultClientset, err = newDynamicK8sClientInCluster()
	} else {
		dynamicClientset, defaultClientset, err = newDynamicK8sClientOutCluster()
	}

	if err != nil {
		return nil, err
	}

	return &K8sConnection{dynamicClientset, defaultClientset}, nil
}

func newDynamicK8sClientOutCluster() (dynamic.Interface, *kubernetes.Clientset, error) {
	var kubeconfig *string
	if home := os.Getenv("HOME"); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}

	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		return nil, nil, err
	}

	dynamicClient, err := dynamic.NewForConfig(config)
	if err != nil {
		return nil, nil, err
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, nil, err
	}

	return dynamicClient, clientset, nil
}

func newDynamicK8sClientInCluster() (dynamic.Interface, *kubernetes.Clientset, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		panic(err.Error())
	}

	dynamicClient, err := dynamic.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, nil, err
	}

	return dynamicClient, clientset, nil
}
