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

import 'jest'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums/cd-type.enum'
import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces/git-providers.type'
import { ClusterProviderEnum } from '../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { OctopipeRequestBuilder } from '../../../../app/v2/core/integrations/octopipe/request-builder'
import { completeOctopipeDeploymentWithOverrides } from './fixtures/deployment/complete-request-override'
import { completeRequestWithUnusedRoutes } from './fixtures/deployment/complete-request-override-remove-unused-routes'

describe('V2 Octopipe Deployment Request Builder', () => {

  it('Should undeploy A:v1 and B:v1 but keep C:v2 when new deploy is A:v2, B:V2 and C:v2 and current components are A:v1, B:V1 and C:v2', async() => {

    const deploymentWith3Components: Deployment = {
      id: 'deployment-id',
      authorId: 'user-1',
      callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
      cdConfiguration: {
        id: 'cd-configuration-id',
        type: CdTypeEnum.OCTOPIPE,
        configurationData: {
          gitProvider: GitProvidersEnum.GITHUB,
          gitToken: 'git-token',
          provider: ClusterProviderEnum.DEFAULT,
          namespace: 'sandbox'
        },
        name: 'octopipeconfiguration',
        authorId: 'user-2',
        workspaceId: 'workspace-id',
        createdAt: new Date(),
        deployments: null
      },
      defaultCircle: false,
      circleId: 'circle-id',
      createdAt: new Date(),
      components: [
        {
          id: 'component-id-1',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/A:v2',
          name: 'A',
          running: false,
          gatewayName: null,
          hostValue: null
        },
        {
          id: 'component-id-2',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/B:v2',
          name: 'B',
          running: false,
          gatewayName: null,
          hostValue: null
        },
        {
          id: 'component-id-3',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/C:v2',
          name: 'C',
          running: false,
          gatewayName: null,
          hostValue: null
        }
      ]
    }

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id4',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
          circleId: 'circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: false
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id5',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
          circleId: 'circle-id',
          defaultCircle: false,
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          }
        }
      },
      {
        id: 'component-id-66',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v2',
        imageUrl: 'https://repository.com/C:v2',
        name: 'C',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'component-id-66',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
          circleId: 'circle-id',
          defaultCircle: false,
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          }
        }
      },
      {
        id: 'component-id-6',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: true
        }
      },
      {
        id: 'component-id-7',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/B:v0',
        name: 'B',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id7',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=7',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: true
        }
      },
      {
        id: 'component-id-8',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/C:v0',
        name: 'C',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id8',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=8',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: true
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith3Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeOctopipeDeploymentWithOverrides)
  })

  it('Should undeploy updated components from circle and remove component that is not present on deployment request', async() => {

    const deploymentWith3Components: Deployment = {
      id: 'deployment-id',
      authorId: 'user-1',
      callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
      cdConfiguration: {
        id: 'cd-configuration-id',
        type: CdTypeEnum.OCTOPIPE,
        configurationData: {
          gitProvider: GitProvidersEnum.GITHUB,
          gitToken: 'git-token',
          provider: ClusterProviderEnum.DEFAULT,
          namespace: 'sandbox'
        },
        name: 'octopipeconfiguration',
        authorId: 'user-2',
        workspaceId: 'workspace-id',
        createdAt: new Date(),
        deployments: null
      },
      defaultCircle: false,
      circleId: 'circle-id',
      createdAt: new Date(),
      components: [
        {
          id: 'component-id-1',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/A:v2',
          name: 'A',
          running: false,
          gatewayName: null,
          hostValue: null
        },
        {
          id: 'component-id-2',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/B:v2',
          name: 'B',
          running: false,
          gatewayName: null,
          hostValue: null
        },
        {
          id: 'component-id-3',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/D:v2',
          name: 'D',
          running: false,
          gatewayName: null,
          hostValue: null
        }
      ]
    }

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id4',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
          circleId: 'circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: false
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id5',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
          circleId: 'circle-id',
          defaultCircle: false,
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          }
        }
      },
      {
        id: 'component-id-66',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v2',
        imageUrl: 'https://repository.com/C:v2',
        name: 'C',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'component-id-66',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
          circleId: 'circle-id',
          defaultCircle: false,
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          }
        }
      },
      {
        id: 'component-id-6',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: true
        }
      },
      {
        id: 'component-id-7',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/B:v0',
        name: 'B',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id7',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=7',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: true
        }
      },
      {
        id: 'component-id-8',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/C:v0',
        name: 'C',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id8',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=8',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          cdConfiguration: {
            id: 'cd-configuration-id',
            type: CdTypeEnum.OCTOPIPE,
            configurationData: {
              gitProvider: GitProvidersEnum.GITHUB,
              gitToken: 'git-token',
              provider: ClusterProviderEnum.DEFAULT,
              namespace: 'sandbox'
            },
            name: 'octopipeconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
          defaultCircle: true
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith3Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeRequestWithUnusedRoutes)
  })

})
