import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Deployment } from '../../interfaces'

const getSuccessWebhookStage = (deployment: Deployment, stageId: number): Stage => ({
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
  requisiteStageRefIds: [
    '13',
    '17'
  ],
  stageEnabled: {
    expression: '${ deploymentResult && proxyDeploymentsResult }',
    type: 'expression'
  },
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: `${deployment.callbackUrl}`
})