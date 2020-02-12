import { IStageEnabled } from '../../interfaces'

export interface IBaseDeployment {
  stageEnabled: IStageEnabled | {}
  account: string
  cloudProvider: 'kubernetes'
  moniker: {
    app: string
  }
  manifestArtifactAccount: 'embedded-artifact'
  completeOtherBranchesThenFail: false
  continuePipeline: true
  failPipeline: false
  manifestArtifactId: string
  name: string
  skipExpressionEvaluation: false
  source: 'artifact'
  trafficManagement: {
    enabled: false
    options: {
      enableTraffic: false
      services: []
    }
  },
  type: 'deployManifest'
  refId: string
  requisiteStageRefIds: string[]
}

const baseDeployment = (manifestId: string, stageName: string, refId: string,
                        reqRefId: string[], previousStage: string | undefined | string[],
                        appName: string, account: string): IBaseDeployment => {
  const deployment: IBaseDeployment = {
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
