package mozart

import (
	"context"
	"log"
	"octopipe/pkg/connection/fake"
	deployerFake "octopipe/pkg/deployer/fake"
	executionFake "octopipe/pkg/execution/fake"
	"octopipe/pkg/pipeline"
	"testing"

	"gopkg.in/go-playground/assert.v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

var fakeVersions = []*pipeline.Version{
	&pipeline.Version{Version: "version-1", VersionURL: "registry/component:version-1"},
	&pipeline.Version{Version: "version-2", VersionURL: "registry/component:version-2"},
	&pipeline.Version{Version: "version-3", VersionURL: "registry/component:version-3"},
	&pipeline.Version{Version: "version-4", VersionURL: "registry/component:version-4"},
	&pipeline.Version{Version: "version-5", VersionURL: "registry/component:version-5"},
}

var fakeUnusedVersions = []*pipeline.Version{
	&pipeline.Version{Version: "version-12", VersionURL: "registry/component:version-12"},
	&pipeline.Version{Version: "version-13", VersionURL: "registry/component:version-13"},
}

var fakeIstioComponents = &pipeline.Istio{
	VirtualService: map[string]interface{}{
		"virtualService": map[string]string{"Kind": "VirtualService"},
	},
	DestinationRules: map[string]interface{}{
		"destinarionRules": map[string]string{"Kind": "DestinationRules"},
	},
}

var fakePipeline = &pipeline.Pipeline{
	Name:           "FakeComponent",
	Namespace:      "fake-namespace",
	Versions:       fakeVersions,
	UnusedVersions: fakeUnusedVersions,
	Istio:          *fakeIstioComponents,
}

func TestDeployVersions(t *testing.T) {
	executionManagerFake := executionFake.NewExecutionFake()
	k8sFakeClientset := fake.NewK8sFakeClient()
	deployerManagerFake := deployerFake.NewDeployerManagerFake(k8sFakeClientset)
	mozart := NewMozart(deployerManagerFake, executionManagerFake)

	resource := schema.GroupVersionResource{
		Group:    "apps",
		Version:  "v1beta2",
		Resource: "deployments",
	}

	err := mozart.deployVersion(fakePipeline, fakeVersions[0], context.Background())
	if err != nil {
		log.Fatalln(err)
		return
	}

	deployedRes, _ := k8sFakeClientset.DynamicClientset.Resource(resource).Namespace(
		fakePipeline.Namespace,
	).Get(fakeVersions[0].Version, metav1.GetOptions{})

	assert.Equal(t, deployedRes.GetName(), fakeVersions[0].Version)
}

func Test(t *testing.T) {

}
