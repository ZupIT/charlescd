const baseDeployment = (manifestId: string, stageName: string, refId: string,
                        reqRefId: string[], previousStage: string | undefined | string[],
                        appName: string, account: string) => {
  const deployment = {
    stageEnabled: {},
    account: account || 'default',
    cloudProvider: 'kubernetes',
    moniker: {
      app: appName
    },
    manifestArtifactAccount: 'embedded-artifact',
    completeOtherBranchesThenFail: false,
    continuePipeline: true,
    failPipeline: false,
    manifestArtifactId: manifestId,
    name: stageName,
    skipExpressionEvaluation: false,
    source: 'artifact',
    trafficManagement: {
      enabled: false,
      options: {
        enableTraffic: false,
        services: []
      }
    },
    type: 'deployManifest',
    refId,
    requisiteStageRefIds: reqRefId
  }
  if (previousStage) {
    deployment.stageEnabled = {
      expression: '${ #stage(\'' + previousStage + '\').status.toString() == \'SUCCEEDED\'}',
      type: 'expression'
    }
  }

  return deployment
}

export default baseDeployment
