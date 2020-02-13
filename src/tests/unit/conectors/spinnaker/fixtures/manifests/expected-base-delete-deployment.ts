const expectedBaseDeleteDeployment = {
  account: 'account',
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  kinds: [
    'deployment'
  ],
  labelSelectors: {
    selectors: [
      {
        key: 'app',
        kind: 'EQUALS',
        values: [
          'app-namespace'
        ]
      },
      {
        key: 'version',
        kind: 'EQUALS',
        values: [
          'app-namespace-unused-version'
        ]
      }
    ]
  },
  location: 'app-namespace',
  mode: 'label',
  name: 'Delete Deployments',
  nameStage: 'Delete Deployments',
  options: {
    cascading: true,
    gracePeriodSeconds: null
  },
  refId: '123',
  requisiteStageRefIds: [
    'req-ref-id'
  ],
  stageEnabled: {
    expression: '${ #stage(\'prev-stage\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
  type: 'deleteManifest'
}

export default expectedBaseDeleteDeployment
