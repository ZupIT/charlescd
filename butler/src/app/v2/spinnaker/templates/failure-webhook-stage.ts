import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Deployment } from '../../interfaces'

const getFailureWebhookStage = (deployment: Deployment, stageId: number): Stage => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': 'Default' // TODO put incomingCircleId here
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger Failure Webhook',
  payload: {
    status: 'FAILURE'
  },
  refId: `${stageId}`,
  requisiteStageRefIds: [
    '13',
    '17'
  ],
  stageEnabled: {
    expression: '${ !deploymentResult || !proxyDeploymentsResult }',
    type: 'expression'
  },
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: `${deployment.callbackUrl}`
})