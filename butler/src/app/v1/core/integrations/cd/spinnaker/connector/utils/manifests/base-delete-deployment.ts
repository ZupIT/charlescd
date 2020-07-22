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

import { ISpinnakerPipelineConfiguration } from '../../../interfaces'

interface IDeleteSelector {
  key: string
  kind: string
  values: string[]
}

export interface IBaseDelete {
  account: string
  cloudProvider: 'kubernetes'
  kinds: ['deployment']
  labelSelectors: {
    selectors: IDeleteSelector[]
  }
  location: string
  mode: 'label'
  name: 'Delete Deployments'
  nameStage: 'Delete Deployments'
  options: {
    cascading: true
    gracePeriodSeconds: null
  }
  completeOtherBranchesThenFail: false
  continuePipeline: true
  failPipeline: false
  refId: string
  requisiteStageRefIds: string[]
  stageEnabled: {
    expression: string
    type: 'expression'
  }
  type: 'deleteManifest'
}

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
): IBaseDelete => ({
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
        values: unusedVersions.map(
          unuserVersion => `${appName}-${unuserVersion.version}`
        )
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
    expression:
      '${ #stage(\'' + previousStage + '\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
  type: 'deleteManifest'
})

export default baseDeleteDeployments
