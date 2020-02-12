const expectedBaseStageHelm = {
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  expectedArtifacts: [
    {
      defaultArtifact: {
        customKind: true,
        id: 'useless - deployment - version'
      },
      displayName: 'deployment - version',
      id: 'deployment - version',
      matchArtifact: {
        id: 'useless - deployment - version - match',
        name: 'app-name',
        type: 'embedded/base64'
      },
      useDefaultArtifact: false,
      usePriorArtifact: false
    }
  ],
  failPipeline: false,
  inputArtifacts: [
    {
      account: 'github-config',
      id: 'template - app-name'
    },
    {
      account: 'github-config',
      id: 'value - app-name'
    }
  ],
  name: 'Bake version',
  namespace: 'app-namespace',
  outputName: 'app-name-version',
  overrides: {
    'image.tag': 'version.url',
    'name': 'version'
  },
  refId: 'ref-if',
  requisiteStageRefIds: [
    'req-ref-id'
  ],
  stageEnabled: {},
  templateRenderer: 'HELM2',
  type: 'bakeManifest'
}

export default expectedBaseStageHelm
