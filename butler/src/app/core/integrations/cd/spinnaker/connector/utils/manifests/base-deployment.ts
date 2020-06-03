/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IStageEnabled } from '../../interfaces'

export interface IBaseDeployment {
  stageEnabled: IStageEnabled | Record<string, unknown>
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
