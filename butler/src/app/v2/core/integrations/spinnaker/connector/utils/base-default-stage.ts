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

import { IStageEnabled } from '../interfaces'
import { ISpinnakerBaseService } from './manifests/base-service'

const buildSingleExpression = (stage: string) => '${ #stage(\'' + stage + '\').status.toString() == \'SUCCEEDED\'}'

const buildMultiplesExpressions = (stages: string[]) => {
  const expressions = stages.map((stage) => buildSingleExpression(stage))
  return expressions.join(' && ')
}

export interface IBaseStage {
  stageEnabled: IStageEnabled | Record<string, unknown>
  account: string | 'default'
  cloudProvider: 'kubernetes'
  completeOtherBranchesThenFail: false
  continuePipeline: true
  failPipeline: false
  manifests: ISpinnakerBaseService[]
  moniker: {
    app: string
  }
  name: string
  skipExpressionEvaluation: false
  source: 'text'
  trafficManagement: {
    enabled: false
    options: {
      enableTraffic: false
      services: []
    }
  }
  type: 'deployManifest'
  refId: string
  requisiteStageRefIds: string[]
}

const baseStage = (manifest: ISpinnakerBaseService, nameStage: string, account: string, refId: string, reqRefIds: string[],
  previousStages: string | undefined | string[]): IBaseStage => {

  const baseStageTemplate: IBaseStage = {
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
