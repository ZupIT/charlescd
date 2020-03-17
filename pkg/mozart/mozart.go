package mozart

import (
	"octopipe/pkg/deployer"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/utils"
	"sync"
)

type Mozart struct {
	deployer deployer.UseCases
}

type UseCases interface {
	Start(pipeline *pipeline.Pipeline)
}

func NewMozart(deployer deployer.UseCases) *Mozart {
	return &Mozart{deployer}
}

func (mozart *Mozart) Start(pipeline *pipeline.Pipeline) {
	mozart.deployComponentsToCluster(pipeline)
	mozart.deployIstioComponentsToCluster(pipeline)
}

func (mozart *Mozart) deployComponentsToCluster(pipeline *pipeline.Pipeline) {
	for _, component := range pipeline.Versions {
		mozart.deployComponentManifestsToCluster(pipeline, component)
	}
}

func (mozart *Mozart) deployComponentManifestsToCluster(pipeline *pipeline.Pipeline, component *pipeline.Version) {
	var wg sync.WaitGroup
	manifests, err := mozart.deployer.GetManifestsByHelmChart(pipeline, component)
	if err != nil {
		utils.CustomLog("error", "deployComponentManifestsToCluster", err.Error())
		return
	}

	for _, manifest := range manifests {
		wg.Add(1)
		go mozart.deployer.Deploy(manifest.(map[string]interface{}), false, &wg)
	}

	wg.Wait()
}

func (mozart *Mozart) deployIstioComponentsToCluster(pipeline *pipeline.Pipeline) {
	var wg sync.WaitGroup

	for _, istioManifest := range pipeline.Istio {
		wg.Add(1)
		go mozart.deployer.Deploy(istioManifest.(map[string]interface{}), true, &wg)
	}

	wg.Wait()
}
