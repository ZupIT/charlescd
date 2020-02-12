export interface IBaseWebhook {
  completeOtherBranchesThenFail: false
  continuePipeline: true
  customHeaders: {
    'x-circle-id': string | 'Default'
  }
  failPipeline: false
  method: 'POST'
  name: 'Trigger webhook'
  payload: {
    status: string
  }
  refId: string
  requisiteStageRefIds: string[]
  statusUrlResolution: 'getMethod'
  type: 'webhook'
  url: string
}

const webhookBaseStage = (uriWebhook: string, refId: string, requisiteRefId: string[], previousStage: string, xCircleId: string): IBaseWebhook => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': xCircleId || 'Default'
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger webhook',
  payload: {
    status: '${#stage( \'' + previousStage + '\' ).status.toString()}'
  },
  refId,
  requisiteStageRefIds: requisiteRefId,
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: uriWebhook
})

export default webhookBaseStage
