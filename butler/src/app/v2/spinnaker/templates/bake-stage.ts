import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Component } from '../../interfaces'

export const getBakeStage = (component: Component, stageId: number): Stage => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  expectedArtifacts: [
    {
      defaultArtifact: {
        customKind: true,
        id: `useless - deployment - ${component.imageTag}`
      },
      displayName: `deployment - ${component.imageTag}`,
      id: `deployment - ${component.imageTag}`,
      matchArtifact: {
        id: `useless - deployment - ${component.imageTag} - match`,
        name: `${component.name}-${component.imageTag}`,
        type: 'embedded/base64'
      },
      useDefaultArtifact: false,
      usePriorArtifact: false
    }
  ],
  failPipeline: false,
  inputArtifacts: [
    {
      account: 'github-artifact',
      id: `template - ${component.name}`
    },
    {
      account: 'github-artifact',
      id: `value - ${component.name}`
    }
  ],
  name: `Bake ${component.name} ${component.imageTag}`,
  namespace: 'sandbox',
  outputName: `${component.name}-${component.imageTag}`,
  overrides: {
    'image.tag': `${component.imageUrl}`,
    name: `${component.imageTag}`
  },
  refId: `${stageId}`,
  requisiteStageRefIds: [],
  stageEnabled: {
    type: 'expression'
  },
  templateRenderer: 'HELM2',
  type: 'bakeManifest'
})