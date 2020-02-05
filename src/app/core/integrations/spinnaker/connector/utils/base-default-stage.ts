const baseStage = (
  manifest,
  nameStage,
  account,
  refId,
  reqRefIds,
  previousStages
) => {
  const buildSingleExpression = (stage) => '${ #stage(\'' + stage + '\').status.toString() == \'SUCCEEDED\'}'

  const buildMultiplesExpressions = (stages) => {
    return stages.reduce((acc, stage, index) => {
      console.log(stages.length)
      if (stages.length === (index + 1)) {
        acc += '${ #stage(\'' + stage + '\').status.toString() == \'SUCCEEDED\'}'
        return acc
      }
      acc += '${ #stage(\'' + stage + '\').status.toString() == \'SUCCEEDED\'} && '
      return acc
    }, '')
  }

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
      // eslint-disable-next-line quotes
      expression: typeof previousStages === 'object'
        ? buildMultiplesExpressions(previousStages)
        : buildSingleExpression(previousStages),
      type: 'expression'
    }
  }
  return baseStageTemplate
}

export default baseStage
