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

package mozart

import (
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/pipeline"
	"octopipe/pkg/template"
)

func getStages(deployment *deployment.Deployment) [][]*pipeline.Step {
	deployedVersionSteps := getDeployedVersionsStepsByDeployment(deployment)
	undeployedVersionsSteps := getUndeployedVersionsStepsByDeployment(deployment)
	istioComponentSteps := getIstioComponentsSteps(deployment)

	stages := [][]*pipeline.Step{
		deployedVersionSteps,
		undeployedVersionsSteps,
		istioComponentSteps,
	}

	return stages
}

func getDeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []*pipeline.Step {
	return getStepsByVersions(deployment, deployment.Versions, deployer.DeployAction)
}

func getUndeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []*pipeline.Step {
	return getStepsByVersions(deployment, deployment.UnusedVersions, deployer.UndeployAction)
}

func getStepsByVersions(
	deployment *deployment.Deployment, versions []*deployment.Version, action string,
) []*pipeline.Step {
	steps := []*pipeline.Step{}
	for _, version := range versions {
		steps = append(steps, &pipeline.Step{
			Name:        version.Version,
			ModuleName:  deployment.Name,
			Namespace:   deployment.Namespace,
			Action:      action,
			Webhook:     deployment.Webhook,
			ForceUpdate: false,
			Git: &pipeline.Git{
				Provider: deployment.GitAccount.Provider,
				Token:    deployment.GitAccount.Token,
			},
			Template: &pipeline.Template{
				Type:       template.TypeHelmTemplate,
				Repository: deployment.HelmRepository,
				Override: map[string]string{
					"Name":      version.Version,
					"Namespace": deployment.Namespace,
					"image.tag": version.VersionURL,
				},
			},
			K8sConfig: &deployment.K8s,
		})
	}

	return steps
}

func getIstioComponentsSteps(deployment *deployment.Deployment) []*pipeline.Step {
	steps := []*pipeline.Step{}
	for _, value := range deployment.Istio {
		steps = append(steps, &pipeline.Step{
			Name:        deployment.Name,
			ModuleName:  deployment.Name,
			Namespace:   deployment.Namespace,
			Action:      deployer.DeployAction,
			Webhook:     deployment.Webhook,
			Manifest:    value.(map[string]interface{}),
			ForceUpdate: true,
			Git: &pipeline.Git{
				Provider: deployment.GitAccount.Provider,
				Token:    deployment.GitAccount.Token,
			},
			K8sConfig: &deployment.K8s,
		})
	}

	return steps
}
