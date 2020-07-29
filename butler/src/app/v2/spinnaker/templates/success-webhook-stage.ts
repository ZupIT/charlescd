import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Component, Deployment } from '../../interfaces'

export const getSuccessWebhookStage = (deployment: Deployment, stageId: number): Stage => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': 'Default' // TODO put incomingCircleId here
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger Success Webhook',
  payload: {
    status: 'SUCCEEDED'
  },
  refId: `${stageId}`,
  requisiteStageRefIds: deployment?.components ? getRequisiteStageRefIds(deployment.components) : [],
  stageEnabled: {
    expression: '${ deploymentResult && proxyDeploymentsResult }',
    type: 'expression'
  },
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: `${deployment.callbackUrl}`
})

const getRequisiteStageRefIds = (components: Component[]): string[] => { // TODO fix this magic?
  const deploymentsEvalId: number = (components.length * 4) + 1
  const proxiesEvalId: number = deploymentsEvalId + components.length + 1
  return [
    `${deploymentsEvalId}`,
    `${proxiesEvalId}`
  ]
}