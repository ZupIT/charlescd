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

import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Component } from '../../../../../api/deployments/interfaces'

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
  return components.map(() => {
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
