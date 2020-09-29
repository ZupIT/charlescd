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
import { CdConfiguration, Component } from '../../../../../api/deployments/interfaces'

export const getDeploymentStage = (component: Component, configuration: CdConfiguration, stageId: number): Stage => ({
  account: (configuration.configurationData as ISpinnakerConfigurationData).account,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifestArtifactAccount: 'embedded-artifact',
  manifestArtifactId: `deployment - ${component.imageTag}`,
  moniker: {
    app: 'default'
  },
  name: `Deploy ${component.name} ${component.imageTag}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${stageId - 1}`
  ],
  skipExpressionEvaluation: false,
  source: 'artifact',
  stageEnabled: {
    expression: '${ #stage(\'' + `Bake ${component.name} ${component.imageTag}` + '\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
  trafficManagement: {
    enabled: false,
    options: {
      enableTraffic: false,
      services: []
    }
  },
  type: 'deployManifest'
})