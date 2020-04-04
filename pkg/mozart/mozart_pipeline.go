package mozart

import (
	"log"
	"octopipe/pkg/deployment"
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
	Template  Template
	Git       Git
}

type Pipeline struct {
	Mozart *Mozart
	Stages [][]Step
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

func (pipeline *Pipeline) executeSteps(steps []Step) {
	for _, step := range steps {
		log.Println(step)
		go pipeline.asyncExecuteStep(step)
	}
}

func (pipeline *Pipeline) asyncExecuteStep(step Step) {

}
