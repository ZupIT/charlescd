/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package pipeline

import (
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/deployment"
	"octopipe/pkg/repository"
	"octopipe/pkg/template"
	"octopipe/pkg/template/helm"
)

type NonAdjustablePipelineVersion struct {
	Version    string `json:"version"`
	VersionURL string `json:"versionUrl"`
}

type NonAdjustablePipelineGithub struct {
	Provider string `json:"provider"`
	Token    string `json:"token"`
}

type NonAdjustablePipeline struct {
	AppName        string                         `json:"appName"`
	AppNamespace   string                         `json:"appNamespace"`
	Git            NonAdjustablePipelineGithub    `json:"git"`
	HelmURL        string                         `json:"helmUrl"`
	Istio          map[string]interface{}         `json:"istio"`
	UnusedVersions []NonAdjustablePipelineVersion `json:"unusedVersions"`
	Versions       []NonAdjustablePipelineVersion `json:"versions"`
	WebHookUrl     string                         `json:"webhookUrl"`
	CircleID       string                         `json:"circleID"`
	K8s            cloudprovider.Cloudprovider    `json:"k8s"`
	CallbackType   string                         `json:"callbackType"`
}

type StepTemplate struct {
	Repository repository.Repository `json:"repository"`
	template.Template
}

type StepWebhook struct {
	Url          string            `json:"url"`
	Headers      map[string]string `json:"headers"`
	Method       string            `json:"method"`
	CallbackType string            `json:"callbackType"`
}

type Step struct {
	Action     string                 `json:"action"`
	Update     bool                   `json:"update"`
	Repository repository.Repository  `json:"repository"`
	Template   template.Template      `json:"template"`
	Manifest   map[string]interface{} `json:"manifest"`
}

type Pipeline struct {
	Name      string                      `json:"name"`
	Namespace string                      `json:"namespace"`
	Stages    [][]Step                    `json:"stages"`
	Webhook   StepWebhook                 `json:"webhook"`
	Config    cloudprovider.Cloudprovider `json:"config"`
}

func (main PipelineMain) NewPipeline() Pipeline {
	return Pipeline{}
}

func (deprecatedPipeline NonAdjustablePipeline) ToPipeline() Pipeline {
	versionsSteps := deprecatedPipeline.generateVersionSteps(deprecatedPipeline.Versions, deployment.DeployAction)
	unusedVersionsSteps := deprecatedPipeline.generateVersionSteps(deprecatedPipeline.UnusedVersions, deployment.UndeployAction)
	istioSteps := deprecatedPipeline.generateIstioSteps()
	pipeline := Pipeline{
		Name:      deprecatedPipeline.AppName,
		Namespace: deprecatedPipeline.AppNamespace,
		Stages: [][]Step{
			versionsSteps,
			unusedVersionsSteps,
			istioSteps,
		},
		Webhook: StepWebhook{
			Url: deprecatedPipeline.WebHookUrl,
			Headers: map[string]string{
				"Content-Type": "application/json",
				"x-circle-id":  deprecatedPipeline.CircleID,
			},
			Method:       "POST",
			CallbackType: deprecatedPipeline.CallbackType,
		},
		Config: deprecatedPipeline.K8s,
	}

	return pipeline
}

func (deprecatedPipeline NonAdjustablePipeline) generateVersionSteps(versions []NonAdjustablePipelineVersion, action string) []Step {
	steps := []Step{}

	for _, version := range versions {
		if version.Version == "" {
			continue
		}

		steps = append(steps, Step{
			Action: action,
			Update: false,
			Repository: repository.Repository{
				Type:  deprecatedPipeline.Git.Provider,
				Url:   deprecatedPipeline.HelmURL,
				Token: deprecatedPipeline.Git.Token,
			},
			Template: template.Template{
				Type: template.HelmType,
				HelmTemplate: helm.HelmTemplate{
					OverrideValues: map[string]string{
						"Name":      version.Version,
						"Namespace": deprecatedPipeline.AppNamespace,
						"image.tag": version.VersionURL,
					},
				},
			},
		})
	}

	return steps
}

func (deprecatedPipeline NonAdjustablePipeline) generateIstioSteps() []Step {
	steps := []Step{}

	for _, version := range deprecatedPipeline.Istio {
		if len(version.(map[string]interface{})) == 0 {
			continue
		}

		steps = append(steps, Step{
			Action:   deployment.DeployAction,
			Update:   true,
			Manifest: version.(map[string]interface{}),
		})
	}

	return steps
}
