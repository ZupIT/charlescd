const webhookBaseStage = (uriWebhook: string, refId: string, requisiteRefId: string[], previousStage: string, xCircleId: string) => ({
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
