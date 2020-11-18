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

import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { ISpinnakerConfigurationData } from '../../../../../../v1/api/configurations/interfaces'
import { CdConfiguration } from '../../../../../api/deployments/interfaces'
import { DeploymentComponent } from '../../../../../api/deployments/interfaces/deployment.interface'

export const getUndeploymentsDeleteUnusedStage = (
  component: DeploymentComponent,
  configuration: CdConfiguration,
  stageId: number,
  evalStageId: number,
  circleId: string
): Stage => ({
  account: `${(configuration.configurationData as ISpinnakerConfigurationData).account}`,
  app: `app-${configuration.id}`,
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
        key: 'component',
        kind: 'EQUALS',
        values: [
          component.name
        ]
      },
      {
        key: 'tag',
        kind: 'EQUALS',
        values: [
          component.imageTag
        ]
      },
      {
        key: 'circleId',
        kind: 'EQUALS',
        values: [
          circleId
        ]
      }
    ]
  },
  location: `${(configuration.configurationData as ISpinnakerConfigurationData).namespace}`,
  mode: 'label',
  name: `Delete Unused Deployment ${component.name} ${component.imageTag}`,
  nameStage: 'Delete Deployments',
  options: {
    cascading: true
  },
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${evalStageId}`
  ],
  stageEnabled: {
    expression: '${proxyUndeploymentsResult}',
    type: 'expression'
  },
  type: 'deleteManifest'
})
