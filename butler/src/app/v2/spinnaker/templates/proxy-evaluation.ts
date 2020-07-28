import { Component } from '../../interfaces'
import { Stage } from '../../interfaces/spinnaker-pipeline.interface'

export const getProxyEvaluationStage = (components: Component[], stageId: number): Stage => (    {
  failOnFailedExpressions: true,
  name: 'Evaluate proxy deployments',
  refId: `${stageId}`,
  requisiteStageRefIds: getRequisiteStageRefIds(components),
  type: 'evaluateVariables',
  variables: [
    {
      key: 'proxyDeploymentsResult',
      value: getProxyDeploymentsResultExpression(components)
    }
  ]
})

const getRequisiteStageRefIds = (components: Component[]): string[] => {
  let baseRefId = components.length * 2
  return components.map(component => {
    baseRefId += 2
    return `${baseRefId}`
  })
}

const getProxyDeploymentsResultExpression = (components: Component[]): string => {
  let expression = ''
  components.forEach((component, index)=> {
    expression = index === 0 ? '${' : expression
    expression += '#stage(\'' + `Deploy Virtual Service ${component.name}` + '\').status.toString() == \'SUCCEEDED\''
    expression = index === components.length - 1 ? `${expression}}` : `${expression} && `
  })
  return expression
}