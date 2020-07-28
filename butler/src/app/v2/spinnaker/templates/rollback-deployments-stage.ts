import { CdConfiguration, Component } from '../../interfaces'
import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'

export const getRollbackDeploymentsStage = (
  component: Component,
  configuration: CdConfiguration,
  stageId: number,
  evalStageId: number
): Stage => ({
  account: (configuration.configurationData as ISpinnakerConfigurationData).account,
  app: '', // TODO is this information necessary?
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
  name: `Delete Deployment ${component.name} ${component.imageTag}`,
  options: {
    cascading: true
  },
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${evalStageId}`
  ],
  stageEnabled: {
    expression: '${!deploymentResult}',
    type: 'expression'
  },
  type: 'deleteManifest'
})