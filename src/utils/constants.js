const baseManifest = {
  account: 'vivo-qa-account',
  cloudProvider: 'kubernetes',
  manifestArtifactAccount: 'embedded-artifact',
  manifests: [],
  name: null,
  refId: null,
  relationships: {
    loadBalancers: [],
    securityGroups: [],
  },
  requisiteStageRefIds: [],
  source: 'text',
  type: 'deployManifest',
}

const baseSpinnaker = (pipelineName, applicationName) => ({
  name: pipelineName,
  application: applicationName,
  appConfig: {},
  keepWaitingPipelines: false,
  lastModifiedBy: '',
  limitConcurrent: true,
  stages: [],
  triggers: [],
  updateTs: '1560803000000',
})

export {
  baseManifest,
  baseSpinnaker
}