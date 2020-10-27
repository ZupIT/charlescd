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

import { GitProvidersEnum } from '../../../../../../app/v1/core/integrations/configuration/interfaces'
import { OctopipeUndeploymentRequest } from '../../../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-undeployment.interface'

export const dummyVirtualServicePipelineOctopipe: OctopipeUndeploymentRequest = {
  namespace: 'sandbox',
  undeployments: [
    {
      componentName: 'A',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/A:v1',
          deploymentName: 'A-v1-circle-id',
          component: 'A',
          tag: 'v1',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: false
    },
    {
      componentName: 'B',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/B:v1',
          deploymentName: 'B-v1-circle-id',
          component: 'B',
          tag: 'v1',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: false
    }
  ],
  proxyDeployments: [
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: 'A',
        namespace: 'sandbox'
      },
      spec: {
        host: 'A',
        subsets: []
      }
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: 'A',
        namespace: 'sandbox'
      },
      spec: {
        gateways: [],
        hosts: [
          'A'
        ],
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
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: 'B',
        namespace: 'sandbox'
      },
      spec: {
        host: 'B',
        subsets: []
      }
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: 'B',
        namespace: 'sandbox'
      },
      spec: {
        gateways: [],
        hosts: [
          'B'
        ],
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
  callbackUrl: 'http://localhost:8883/butler/v2/executions/execution-id/notify',
  clusterConfig: null
}