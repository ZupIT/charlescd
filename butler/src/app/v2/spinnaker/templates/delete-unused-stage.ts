import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { CdConfiguration, Component } from '../../interfaces'
import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'

export const getDeleteUnusedStage = (
  component: Component,
  configuration: CdConfiguration,
  stageId: number,
  evalStageId: number
): Stage => ({
  account: `${(configuration.configurationData as ISpinnakerConfigurationData).account}`,
  app: '', // TODO is this necessary?
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
          `${component.name}`
        ]
      },
      {
        key: 'version',
        kind: 'EQUALS',
        values: [
          `${component.name}-${component.imageTag}`
        ]
      }
    ]
  },
  location: `${(configuration.configurationData as ISpinnakerConfigurationData).namespace}`,
  mode: 'label',
  name: `Delete Unused Deployment ${component.name} ${component.imageTag}`,
  nameStage: 'Delete Deployments',
  options: {
    cascading: true
  },
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${evalStageId}`
  ],
  stageEnabled: {
    expression: '${proxyDeploymentsResult}',
    type: 'expression'
  },
  type: 'deleteManifest'
})