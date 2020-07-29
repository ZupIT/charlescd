import { CdConfiguration, Component } from '../../interfaces'
import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'
import { Stage } from '../../interfaces/spinnaker-pipeline.interface'

export const getDestinationRulesStage = (component: Component, configuration: CdConfiguration, stageId: number): Stage => ({
  account: `${(configuration.configurationData as ISpinnakerConfigurationData).account}`,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: `${component.name}`,
        namespace: `${(configuration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        host: `${component.name}`,
        subsets: [
          {
            labels: {
              version: `${component.name}-${component.imageTag}`
            },
            name: `${component.imageTag}`
          }
        ]
      }
    }
  ],
  moniker: {
    app: 'default'
  },
  name: `Deploy Destination Rules ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    '13' // TODO fix this. How did this pass?
  ],
  skipExpressionEvaluation: false,
  source: 'text',
  stageEnabled: {
    expression: '${deploymentResult}',
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