package fake

import (
	"octopipe/pkg/connection"

	"k8s.io/apimachinery/pkg/runtime"
	dynamicFake "k8s.io/client-go/dynamic/fake"
)

func NewK8sFakeClient() *connection.K8sConnection {
	runtimeScheme := runtime.NewScheme()

	k8sConnection := &connection.K8sConnection{
		DynamicClientset: dynamicFake.NewSimpleDynamicClient(runtimeScheme),
	}

	return k8sConnection
}
