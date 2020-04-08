package mozart

import (
	"octopipe/pkg/deployer"
	"octopipe/pkg/deployment"
	"octopipe/pkg/template"
)

func getStages(deployment *deployment.Deployment) [][]*Step {
	deployedVersionSteps := getDeployedVersionsStepsByDeployment(deployment)
	undeployedVersionsSteps := getUndeployedVersionsStepsByDeployment(deployment)
	istioComponentSteps := getIstioComponentsSteps(deployment)

	stages := [][]*Step{
		deployedVersionSteps,
		undeployedVersionsSteps,
		istioComponentSteps,
	}

	return stages
}

func getDeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []*Step {
	return getStepsByVersions(deployment, deployment.Versions, deployer.DeployAction)
}

func getUndeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []*Step {
	return getStepsByVersions(deployment, deployment.UnusedVersions, deployer.UndeployAction)
}

func getStepsByVersions(
	deployment *deployment.Deployment, versions []*deployment.Version, action string,
) []*Step {
	steps := []*Step{}
	for _, version := range versions {
		steps = append(steps, &Step{
			Name:        version.Version,
			Namespace:   deployment.Namespace,
			Action:      action,
			ForceUpdate: false,
			Git: &Git{
				Provider: deployment.GitAccount.Provider,
				Token:    deployment.GitAccount.Token,
			},
			Template: &Template{
				Type:       template.TypeHelmTemplate,
				Repository: deployment.HelmRepository,
				Override: map[string]interface{}{
					"tag": map[string]interface{}{
						"image": version.VersionURL,
					},
				},
			},
			K8sConfig: &deployment.K8s,
		})
	}

	return steps
}

func getIstioComponentsSteps(deployment *deployment.Deployment) []*Step {
	steps := []*Step{}
	for _, value := range deployment.Istio {
		steps = append(steps, &Step{
			Name:        deployment.Name,
			Namespace:   deployment.Namespace,
			Action:      deployer.DeployAction,
			Manifest:    value.(map[string]interface{}),
			ForceUpdate: true,
			Git: &Git{
				Provider: deployment.GitAccount.Provider,
				Token:    deployment.GitAccount.Token,
			},
			K8sConfig: &deployment.K8s,
		})
	}

	return steps
}
