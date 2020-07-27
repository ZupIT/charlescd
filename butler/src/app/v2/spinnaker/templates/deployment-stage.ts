import { CdConfiguration, Component } from '../../interfaces'
import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'

export const getDeploymentStage = (component: Component, configuration: CdConfiguration, stageId: number): Stage => ({
  account: (configuration.configurationData as ISpinnakerConfigurationData).account,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifestArtifactAccount: 'embedded-artifact',
  manifestArtifactId: `deployment - ${component.imageTag}`,
  moniker: {
    app: `${component.name}`
  },
  name: `Deploy ${component.name} ${component.imageTag}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${stageId - 1}`
  ],
  skipExpressionEvaluation: false,
  source: 'artifact',
  stageEnabled: {
    expression: '${ #stage(\'' + `Bake ${component.name} ${component.imageTag}` + '\').status.toString() == \'SUCCEEDED\'}',
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
})