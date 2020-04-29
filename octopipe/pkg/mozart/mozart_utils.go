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
	return getStepsByVersions(deployment, deployment.Versions, deployer.DeployAction, deployer.UndeployAction)
}

func getUndeployedVersionsStepsByDeployment(deployment *deployment.Deployment) []*pipeline.Step {
	return getStepsByVersions(deployment, deployment.UnusedVersions, deployer.UndeployAction, deployer.DeployAction)
}

func getStepsByVersions(
	deployment *deployment.Deployment, versions []*deployment.Version, action string, rollbackAction string,
) []*pipeline.Step {
	steps := []*pipeline.Step{}
	for _, version := range versions {
		steps = append(steps, &pipeline.Step{
			Name:        	version.Version,
			ModuleName:  	deployment.Name,
			Namespace:   	deployment.Namespace,
			Action:      	action,
			RollbackAction: rollbackAction,
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

func convertToRollbackSteps(steps []*pipeline.Step) []*pipeline.Step {
	var rollbackSteps []*pipeline.Step
	for _, step := range steps {
		rollbackStep := *step
		rollbackStep.Action, rollbackStep.RollbackAction = step.RollbackAction, step.Action
		rollbackSteps = append(rollbackSteps, &rollbackStep)
	}
	return rollbackSteps
}
