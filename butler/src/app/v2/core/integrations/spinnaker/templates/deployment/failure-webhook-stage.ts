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
import { Component, Deployment } from '../../../../../api/deployments/interfaces'
import { DeploymentStatusEnum } from '../../../../../../v1/api/deployments/enums'
import { ExecutionTypeEnum } from '../../../../../api/deployments/enums'
import { UrlUtils } from '../../../../utils/url.utils'
import { ConnectorConfiguration } from '../../connector'

export const getFailureWebhookStage = (deployment: Deployment, stageId: number, configuration: ConnectorConfiguration): Stage => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': `${configuration.incomingCircleId}`
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger Failure Webhook',
  payload: {
    status: DeploymentStatusEnum.FAILED,
    type: ExecutionTypeEnum.DEPLOYMENT
  },
  refId: `${stageId}`,
  requisiteStageRefIds: deployment?.components ? getRequisiteStageRefIds(deployment.components) : [],
  stageEnabled: {
    expression: '${ !deploymentResult || !proxyDeploymentsResult }',
    type: 'expression'
  },
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: UrlUtils.getDeploymentNotificationUrl(configuration.executionId)
})

const getRequisiteStageRefIds = (components: Component[]): string[] => {
  const deploymentsEvalId: number = (components.length * 4) + 1
  const proxiesEvalId: number = deploymentsEvalId + components.length + 1
  return [
    `${deploymentsEvalId}`,
    `${proxiesEvalId}`
  ]
}
