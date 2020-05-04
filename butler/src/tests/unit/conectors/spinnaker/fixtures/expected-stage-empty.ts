const expectedEmpty = {
  account: 'account',
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        labels: {
          app: 'darwin-ui',
          service: 'darwin-ui'
        },
        name: 'darwin-ui',
        namespace: 'qa'
      },
      spec: {
        ports: [
          {
            name: 'http',
            port: 3000,
            targetPort: 3000
          }
        ],
        selector: {
          app: 'darwin-ui'
        }
      }
    }
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
  stageEnabled: {},
  trafficManagement: {
    enabled: false,
    options: {
      enableTraffic: false,
      services: []
    }
  },
  type: 'deployManifest'
}

export default expectedEmpty
