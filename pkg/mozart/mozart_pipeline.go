package mozart

import (
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/git"
	"octopipe/pkg/template"
	"octopipe/pkg/utils"
	"sync"
)

type Git struct {
	Provider string
	Token    string
}

type Template struct {
	Type       string
	Repository string
	Override   map[string]interface{}
}

type Step struct {
	Name        string
	Namespace   string
	Action      string
	ForceUpdate bool
	Manifest    map[string]interface{}
	Template    *Template
	Git         *Git
	K8sConfig   *cloudprovider.Provider
}

type Pipeline struct {
	Mozart *Mozart
	Stages [][]*Step
}

func NewPipeline(mozart *Mozart, deployment *deployment.Deployment) *Pipeline {
	return &Pipeline{
		Mozart: mozart,
		Stages: getStages(deployment),
	}
}

func (pipeline *Pipeline) Do() {
	go pipeline.asyncStartPipeline()
}

func (pipeline *Pipeline) asyncStartPipeline() {
	for _, steps := range pipeline.Stages {
		pipeline.executeSteps(steps)
	}
}

func (pipeline *Pipeline) executeSteps(steps []*Step) {
	var waitGroup sync.WaitGroup

	for _, step := range steps {
		waitGroup.Add(1)

		go func(step *Step) {
			defer waitGroup.Done()

			pipeline.asyncExecuteStep(step)
		}(step)
	}

	waitGroup.Wait()
}

func (pipeline *Pipeline) asyncExecuteStep(step *Step) {
	var manifests map[string]interface{}
	var err error

	if step.Manifest != nil {
		manifests["default"] = step.Manifest
		pipeline.executeManifests(step, manifests)
	}

	if step.Template != nil {
		manifests, err = pipeline.getManifestsByTemplateStep(step)
		if err != nil {
			utils.CustomLog("error", "asyncExecuteStep", err.Error())
			return
		}
	}

	if len(manifests) <= 0 {
		utils.CustomLog("error", "asyncExecuteStep", "Not found manifest for execution")
	}

	pipeline.executeManifests(step, manifests)
}

func (pipeline *Pipeline) executeManifests(step *Step, manifests map[string]interface{}) {
	var waitGroup sync.WaitGroup

	for _, manifest := range manifests {
		waitGroup.Add(1)

		go func(manifest interface{}) {
			defer waitGroup.Done()

			pipeline.asyncExecuteManifest(step, manifest.(map[string]interface{}))
		}(manifest)
	}

	waitGroup.Wait()
}

func (pipeline *Pipeline) asyncExecuteManifest(step *Step, manifest map[string]interface{}) {
	cloudConfig := cloudprovider.NewCloudProvider(step.K8sConfig)
	resource := &deployer.Resource{
		Action:      step.Action,
		Manifest:    deployer.ToUnstructured(manifest),
		ForceUpdate: step.ForceUpdate,
		Config:      cloudConfig,
		Namespace:   step.Namespace,
	}

	deployer, err := deployer.NewDeployer(resource)
	if err != nil {
		return
	}

	deployer.Do()
}

func (pipeline *Pipeline) getManifestsByTemplateStep(step *Step) (map[string]interface{}, error) {
	gitConfig, err := git.NewGit(step.Git.Provider)
	if err != nil {
		return nil, err
	}
	filesData, err := gitConfig.GetDataFromDefaultFiles(step.Name, step.Git.Token, step.Template.Repository)
	if err != nil {
		return nil, err
	}
	templateProvider, err := template.NewTemplate(step.Template.Type)
	if err != nil {
		return nil, err
	}

	manifests, err := templateProvider.GetManifests(filesData[0], filesData[1])
	if err != nil {
		return nil, err
	}

	return manifests, nil
}
