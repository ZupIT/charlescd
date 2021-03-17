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
import { Component, Deployment } from '../../../../../api/deployments/interfaces'
import { IstioUndeploymentManifestsUtils } from '../../../utils/istio-undeployment-manifests.utils'
import { DeploymentComponent } from '../../../../../api/deployments/interfaces/deployment.interface'
import { ISpinnakerConfigurationData } from '../../../../../api/configurations/interfaces/spinnaker-configuration-data.interface'

export const getUndeploymentVirtualServiceStage = (
  component: DeploymentComponent,
  deployment: Deployment,
  activeComponents: Component[],
  stageId: number,
  evalStageId?: number
): Stage => ({

  account: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).account}`,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    IstioUndeploymentManifestsUtils.getVirtualServiceManifest(deployment, component, activeComponents)
  ],
  moniker: {
    app: 'default'
  },
  name: `Undeploy Virtual Service ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: evalStageId ? [`${stageId - 1}`] : [],
  skipExpressionEvaluation: false,
  stageEnabled: evalStageId ?  {
    expression: '${ #stage(\'Undeploy Destination Rules C\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  }: undefined,
  source: 'text',
  trafficManagement: {
    enabled: false,
    options: {
      enableTraffic: false,
      services: []
    }
  },
  type: 'deployManifest'
})
