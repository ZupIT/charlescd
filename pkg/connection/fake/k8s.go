package fake

import (
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/dynamic/fake"
	"octopipe/pkg/connection"
)

func NewK8sFakeClient() *connection.K8sConnection {
	runtimeScheme := runtime.NewScheme()

	k8sConnection := &connection.K8sConnection{
		DynamicClientset: fake.NewSimpleDynamicClient(runtimeScheme),
	}

	return k8sConnection
}