package mozart

import (
	"octopipe/pkg/deployment"
	"octopipe/pkg/template"
)

func getStages(deployment *deployment.Deployment) [][]Step {
	deployedVersionSteps := getDeployedVersionsStepsByDeployment(deployment)
	undeployedVersionsSteps := getUndeployedVersionsStepsByDeployment(deployment)
	istioComponentSteps := getIstioComponentsSteps(deployment)

	return [][]Step{
		deployedVersionSteps,
		undeployedVersionsSteps,
		istioComponentSteps,
	}
}

func getDeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []Step {
	return getStepsByVersions(deployment, deployment.Versions, typeDeployAction)
}

func getUndeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []Step {
	return getStepsByVersions(deployment, deployment.UnusedVersions, typeUndeployAction)
}

func getStepsByVersions(
	deployment *deployment.Deployment, versions []*deployment.Version, action string,
) []Step {
	steps := []Step{}
	for _, version := range versions {
		steps = append(steps, Step{
			Name:      version.Version,
			Namespace: deployment.Namespace,
			Action:    action,
			Git: Git{
				Provider: deployment.GitAccount.Provider,
				Token:    deployment.GitAccount.Token,
			},
			Template: Template{
				Type:       template.TypeHelmTemplate,
				Repository: deployment.HelmRepository,
				Override: map[string]interface{}{
					"tag": map[string]interface{}{
						"image": version.VersionURL,
					},
				},
			},
		})
	}

	return steps
}

func getIstioComponentsSteps(deployment *deployment.Deployment) []Step {
	steps := []Step{}
	for _, value := range deployment.Istio {
		steps = append(steps, Step{
			Name:      deployment.Name,
			Namespace: deployment.Namespace,
			Action:    typeDeployAction,
			Manifest:  value.(map[string]interface{}),
			Git: Git{
				Provider: deployment.GitAccount.Provider,
				Token:    deployment.GitAccount.Token,
			},
		})
	}

	return steps
}
