import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Component, Deployment } from '../../interfaces'

export const getDeploymentsEvaluationStage = (components: Component[], stageId: number): Stage => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failOnFailedExpressions: true,
  failPipeline: false,
  name: 'Evaluate deployments',
  refId: `${stageId}`,
  requisiteStageRefIds: getRequisiteStageRefIds(components),
  type: 'evaluateVariables',
  variables: [
    {
      key: 'deploymentResult',
      value: getDeploymentResultExpression(components)
    }
  ]
})

const getRequisiteStageRefIds = (components: Component[]): string[] => {
  let baseRefId = 0
  return components.map(component => {
    baseRefId += 2
    return `${baseRefId}`
  })
}

const getDeploymentResultExpression = (components: Component[]): string => {
  let expression = ''
  components.forEach((component, index)=> {
    expression = index === 0 ? '${' : expression
    expression += '#stage(\'' + `Deploy ${component.name} ${component.imageTag}` + '\').status.toString() == \'SUCCEEDED\''
    expression = index === components.length - 1 ? `${expression}}` : `${expression} && `
  })
  return expression
}