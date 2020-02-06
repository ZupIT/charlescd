import { ISpinnakerPipelineConfiguration } from '../../../interfaces'

const baseDeleteDeployments = (
  {
    account,
    appName,
    appNamespace,
    unusedVersions
  }: ISpinnakerPipelineConfiguration,
  refId: number,
  requisiteRefId: string[],
  previousStage: string | undefined | string[]
) => ({
  account,
  cloudProvider: 'kubernetes',
  kinds: ['deployment'],
  labelSelectors: {
    selectors: [
      {
        key: 'app',
        kind: 'EQUALS',
        values: [appName]
      },
      {
        key: 'version',
        kind: 'EQUALS',
        values: unusedVersions.map(unuserVersion => `${appName}-${unuserVersion.version}`)
      }
    ]
  },
  location: appNamespace,
  mode: 'label',
  name: 'Delete Deployments',
  nameStage: 'Delete Deployments',
  options: {
    cascading: true,
    gracePeriodSeconds: null
  },
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  refId: String(refId),
  requisiteStageRefIds: [String(requisiteRefId)],
  stageEnabled: {
    expression: '${ #stage(\'' + previousStage + '\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
  type: 'deleteManifest'
})

export default baseDeleteDeployments
