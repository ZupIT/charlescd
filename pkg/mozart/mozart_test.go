package mozart

import (
	"octopipe/pkg/connection/fake"
	"octopipe/pkg/deployer"
	"octopipe/pkg/execution"
	"octopipe/pkg/pipeline"
	"testing"
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

func TestStart(t *testing.T) {
	executionFake := execution.NewExecutionFake()
	deployerManager := deployer.NewDeployer(fake.NewK8sFakeClient())
	mozart := NewMozart(deployerManager, executionFake)

	mozart.Start(fakePipeline)
}
