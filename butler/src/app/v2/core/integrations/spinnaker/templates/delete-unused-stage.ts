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

import { Stage } from '../interfaces/spinnaker-pipeline.interface'
import { ISpinnakerConfigurationData } from '../../../../../v1/api/configurations/interfaces'
import { CdConfiguration, Component } from '../../../../api/deployments/interfaces'

export const getDeleteUnusedStage = (
  component: Component,
  configuration: CdConfiguration,
  stageId: number,
  evalStageId: number
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
        key: 'app',
        kind: 'EQUALS',
        values: [
          `${component.name}`
        ]
      },
      {
        key: 'version',
        kind: 'EQUALS',
        values: [
          `${component.name}-${component.imageTag}`
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
    expression: '${proxyDeploymentsResult}',
    type: 'expression'
  },
  type: 'deleteManifest'
})