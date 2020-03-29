package fake

import (
	"k8s.io/apimachinery/pkg/runtime/schema"
	"octopipe/pkg/pipeline"
)

type DeployerManagerFake struct {}

func NewDeployerManagerFake() *DeployerManagerFake {
	return &DeployerManagerFake{}
}

func (deployerManager *DeployerManagerFake) GetManifestsByHelmChart(
	pipeline *pipeline.Pipeline, version *pipeline.Version,
) (map[string]interface{}, error) {
	return nil, nil
}

func (deployerManager *DeployerManagerFake) Deploy(
	manifest map[string]interface{}, forceUpdate bool, resourceSchema *schema.GroupVersionResource,
) error {
	return nil
}

func (deployerManager *DeployerManagerFake) Undeploy(name string, namespace string) error {
	return nil
}


