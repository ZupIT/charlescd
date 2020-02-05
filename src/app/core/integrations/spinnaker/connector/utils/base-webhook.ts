const webhookBaseStage = (
  uriWebhook,
  refId,
  requisiteRefId,
  previousStage,
  // previousStages,
  xCircleId
) => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': xCircleId || 'Default'
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger webhook',
  payload: {
    // eslint-disable-next-line quotes
    status: '${#stage( \'' + previousStage + '\' ).status.toString()}'
  },
  refId,
  requisiteStageRefIds: requisiteRefId,
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: uriWebhook
})

export default webhookBaseStage
