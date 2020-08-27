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

import { ISpinnakerConfigurationData } from '../../../../../../v1/api/configurations/interfaces'
import { Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { Component, Deployment } from '../../../../../api/deployments/interfaces'

export const getUndeploymentEmptyVirtualServiceStage = (
  component: Component,
  deployment: Deployment,
  stageId: number
): Stage => ({

  account: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).account}`,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: component.name,
        namespace: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        gateways: component.gatewayName ? [component.gatewayName] : [],
        hosts: component.hostValue ? [component.hostValue] : [component.name],
        http: [
          {
            match: [
              {
                headers: {
                  'unreachable-cookie-name': {
                    exact: 'unreachable-cookie - value'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'unreachable-app-name'
                }
              }
            ]
          }
        ]
      }
    }
  ],
  moniker: {
    app: 'default'
  },
  name: `Undeploy Virtual Service ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${stageId - 1}`
  ],
  skipExpressionEvaluation: false,
  source: 'text',
  stageEnabled: {
    expression: '${ #stage(\'' + `Undeploy Destination Rules ${component.name}` + '\').status.toString() == \'SUCCEEDED\'}',
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