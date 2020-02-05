const expectedMultiple = {
  account: 'account',
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    'manifest'
  ],
  moniker: {
    app: 'account'
  },
  name: 'stage',
  refId: 'ref-id',
  requisiteStageRefIds: [
    'ref-id-1',
    'ref-id-2'
  ],
  skipExpressionEvaluation: false,
  source: 'text',
  stageEnabled: {
    expression: '${ #stage(\'Stage 1\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
  trafficManagement: {
    enabled: false,
    options: {
      enableTraffic: false,
      services: []
    }
  },
  type: 'deployManifest'
}

export default expectedMultiple
