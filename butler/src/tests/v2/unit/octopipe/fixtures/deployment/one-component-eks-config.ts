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

import { OctopipeDeploymentRequest } from '../../../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-deployment.interface'
import { GitProvidersEnum } from '../../../../../../app/v1/core/integrations/configuration/interfaces'
import { AppConstants } from '../../../../../../app/v1/core/constants'
import { ClusterProviderEnum } from '../../../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'

export const oneComponentEKSOctopipe: OctopipeDeploymentRequest = {
  namespace: 'sandbox',
  deployments: [
    {
      componentName: 'A',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/A:v2',
          deploymentName: 'A-v2-circle-id',
          component: 'A',
          tag: 'v2',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: true
    }
  ],
  unusedDeployments: [],
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
        subsets: [
          {
            labels: {
              component: 'A',
              tag: 'v2',
              circleId: 'circle-id'
            },
            name: 'circle-id'
          },
          {
            labels: {
              component: 'A',
              tag: 'v0',
              circleId: AppConstants.DEFAULT_CIRCLE_ID
            },
            name: AppConstants.DEFAULT_CIRCLE_ID
          }
        ]
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
                  cookie: {
                    regex: '.*x-circle-id=circle-id.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  }
                }
              }
            ]
          },
          {
            match: [
              {
                headers: {
                  'x-circle-id': {
                    exact: 'circle-id'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  }
                }
              }
            ]
          },
          {
            route: [
              {
                destination: {
                  host: 'A',
                  subset: AppConstants.DEFAULT_CIRCLE_ID
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ],
  callbackUrl: 'http://localhost:8883/butler/v2/executions/execution-id/notify',
  clusterConfig: {
    provider: ClusterProviderEnum.EKS,
    awsSID: 'aws-sid',
    awsSecret: 'aws-secret',
    awsRegion: 'aws-region',
    awsClusterName: 'aws-cluster-name'
  }
}