import { ISpinnakerBaseService } from './manifests/base-service'

const buildSingleExpression = (stage: string) => '${ #stage(\'' + stage + '\').status.toString() == \'SUCCEEDED\'}'

const buildMultiplesExpressions = (stages: string[]) => {
  const expressions = stages.map((stage) => buildSingleExpression(stage))
  return expressions.join(' && ')
}

const baseStage = (manifest: ISpinnakerBaseService, nameStage: string, account: string, refId: string, reqRefIds: string[],
                   previousStages: string | undefined | string[]) => {

  const baseStageTemplate = {
    stageEnabled: {},
    account: account || 'default',
    cloudProvider: 'kubernetes',
    completeOtherBranchesThenFail: false,
    continuePipeline: true,
    failPipeline: false,
    manifests: [manifest],
    moniker: {
      app: account
    },
    name: nameStage,
    skipExpressionEvaluation: false,
    source: 'text',
    trafficManagement: {
      enabled: false,
      options: {
        enableTraffic: false,
        services: []
      }
    },
    type: 'deployManifest',
    refId,
    requisiteStageRefIds: reqRefIds
  }
  if (previousStages) {
    baseStageTemplate.stageEnabled = {
      expression: typeof previousStages === 'object'
        ? buildMultiplesExpressions(previousStages)
        : buildSingleExpression(previousStages),
      type: 'expression'
    }
  }
  return baseStageTemplate
}

export default baseStage
