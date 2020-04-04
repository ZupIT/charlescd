package mozart

import (
	"log"
	"octopipe/pkg/deployment"
	"octopipe/pkg/git"
	"octopipe/pkg/template"
	"octopipe/pkg/utils"
)

const (
	typeDeployAction   = "DEPLOY"
	typeUndeployAction = "UNDEPLOY"
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
	Name      string
	Namespace string
	Action    string
	Manifest  map[string]interface{}
	Template  *Template
	Git       *Git
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
	for _, step := range steps {
		log.Println(step)
		go pipeline.asyncExecuteStep(step)
	}
}

func (pipeline *Pipeline) asyncExecuteStep(step *Step) {
	var err error

	if step.Template != nil {
		step.Manifest, err = pipeline.getManifestsByTemplateStep(step)
		if err != nil {
			utils.CustomLog("error", "asyncExecuteStep", err.Error())
			return
		}
	}

	log.Println(step)
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
