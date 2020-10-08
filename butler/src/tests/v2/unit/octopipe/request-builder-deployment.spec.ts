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
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { GitProvidersEnum } from '../../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { OctopipeRequestBuilder } from '../../../../app/v2/core/integrations/octopipe/request-builder'
import { completeOctopipeDeploymentRequest } from './fixtures/deployment/complete-request'
import { noUnusedOctopipeDeploymentRequest } from './fixtures/deployment/no-unused'
import { oneComponentOctopipeDeploymentRequest } from './fixtures/deployment/one-component'
import { oneComponentVSOctopipeDeploymentRequest } from './fixtures/deployment/one-component-virtualservice'
import { oneComponentSameTagDiffCirclesUnusedOctopipe } from './fixtures/deployment/one-component-same-tag-diff-circles-unused'
import { oneComponentWithUnusedOctopipe } from './fixtures/deployment/one-component-with-unused'
import { oneComponentDiffSubsetsSameTagOctopipe } from './fixtures/deployment/one-component-diff-subsets-same-tag'
import { oneComponentSameTagDiffCirclesRollbackOctopipe } from './fixtures/deployment/one-component-same-tag-diff-circles-rollback'
import { oneComponentHostnameGatewayOctopipe } from './fixtures/deployment/one-component-hostname-gateway'
import { oneComponentSameTagSameCircleOctopipe } from './fixtures/deployment/one-component-same-tag-same-circle'
import { oneComponentCustomNamespaceOctopipe } from './fixtures/deployment/one-component-custom-namespace'
import { oneComponentEKSOctopipe } from './fixtures/deployment/one-component-eks-config'
import { oneComponentGenericOctopipe } from './fixtures/deployment/one-component-generic-config'

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

const deploymentWith1ComponentCircle1: Deployment = {
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
    }
  ]
}

const deploymentWith1ComponentCircle2: Deployment = {
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
  circleId: 'circle-id2',
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
    }
  ]
}

const deploymentWith1ComponentOpenSea: Deployment = {
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
  circleId: null,
  createdAt: new Date(),
  components: [
    {
      id: 'component-id-1',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v0',
      imageUrl: 'https://repository.com/A:v0',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null
    }
  ]
}

const deploymentWith1ComponentCircle1HostGateway: Deployment = {
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
      hostValue: 'host-value-1',
      gatewayName: 'gateway-name-1'
    }
  ]
}

const deploymentWith1ComponentCircle1CustomNamespace: Deployment = {
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
      namespace: 'custom-namespace'
    },
    name: 'octopipeconfiguration',
    authorId: 'user-2',
    workspaceId: 'workspace-id',
    createdAt: new Date(),
    deployments: null
  },
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
    }
  ]
}

const deploymentWith1ComponentCircle1EKS: Deployment = {
  id: 'deployment-id',
  authorId: 'user-1',
  callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
  cdConfiguration: {
    id: 'cd-configuration-id',
    type: CdTypeEnum.OCTOPIPE,
    configurationData: {
      provider: ClusterProviderEnum.EKS,
      awsSID: 'aws-sid',
      awsSecret: 'aws-secret',
      awsRegion: 'aws-region',
      awsClusterName: 'aws-cluster-name',
      gitProvider: GitProvidersEnum.GITHUB,
      gitToken: 'git-token',
      namespace: 'sandbox'
    },
    name: 'octopipeconfiguration',
    authorId: 'user-2',
    workspaceId: 'workspace-id',
    createdAt: new Date(),
    deployments: null
  },
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
    }
  ]
}

const deploymentWith1ComponentCircle1GENERIC: Deployment = {
  id: 'deployment-id',
  authorId: 'user-1',
  callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
  cdConfiguration: {
    id: 'cd-configuration-id',
    type: CdTypeEnum.OCTOPIPE,
    configurationData: {
      provider: ClusterProviderEnum.GENERIC,
      host: 'generic-host',
      clientCertificate: 'client-certificate',
      caData: 'ca-data',
      clientKey: 'client-key',
      gitProvider: GitProvidersEnum.GITHUB,
      gitToken: 'git-token',
      namespace: 'sandbox'
    },
    name: 'octopipeconfiguration',
    authorId: 'user-2',
    workspaceId: 'workspace-id',
    createdAt: new Date(),
    deployments: null
  },
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
    }
  ]
}

describe('V2 Octopipe Deployment Request Builder', () => {

  it('should create the correct complete request object with 3 new components and some unused components', async() => {

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
          }
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
          circleId: null,
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
          circleId: null,
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
          circleId: null,
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
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith3Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeOctopipeDeploymentRequest)
  })

  it('should create the correct request object without unused versions', async() => {

    const activeComponents: Component[] = [
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
          circleId: null,
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith3Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(noUnusedOctopipeDeploymentRequest)
  })

  it('should create the correct request object with 1 new component', async() => {

    const activeComponents: Component[] = [
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
          circleId: null,
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle1, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentOctopipeDeploymentRequest)
  })

  it('should create the correct request object with 1 new component and previous circle deployment', async() => {

    const activeComponents: Component[] = [
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-10',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'circle-id2',
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle1, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentVSOctopipeDeploymentRequest)
  })

  it('should create the correct request object with 1 new component and unused version, even with same tag in different circles', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-1',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-2',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-3',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-4',
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
          circleId: 'circle-id2',
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
        }
      },
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle2, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentSameTagDiffCirclesUnusedOctopipe)
  })

  it('should create the correct request object with 1 new component and with correct unused version', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-1',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-2',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-3',
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
          circleId: null,
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
        }
      },
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
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'circle-id2',
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
        }
      },
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle2, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentWithUnusedOctopipe)
  })

  it('should create the correct request object with different subsets with same tag', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-1',
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
          circleId: null,
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
          circleId: 'circle-id3',
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
        }
      },
      {
        id: 'component-id-7',
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
          circleId: 'circle-id5',
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
        }
      },
      {
        id: 'component-id-2',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-3',
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
          circleId: null,
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
        }
      },
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
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'circle-id2',
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle2, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentDiffSubsetsSameTagOctopipe)
  })

  it('should create the correct request object with rollback stage, even with same tag in different circles', async() => {

    const activeComponents: Component[] = [
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
          circleId: 'circle-id3',
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
        }
      },
      {
        id: 'component-id-7',
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
          circleId: 'circle-id5',
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
        }
      },
      {
        id: 'component-id-2',
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-3',
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
          circleId: null,
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
        }
      },
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
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'circle-id2',
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentOpenSea, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentSameTagDiffCirclesRollbackOctopipe)
  })

  it('should create the correct request object with custom host name and gateway name', async() => {

    const activeComponents: Component[] = [
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
          circleId: null,
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
        }
      },
      {
        id: 'component-id-10',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'circle-id2',
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(
        deploymentWith1ComponentCircle1HostGateway, activeComponents,
        { executionId: 'execution-id', incomingCircleId: 'Default' }
      )
    ).toEqual(oneComponentHostnameGatewayOctopipe)
  })

  it('should create the correct request object with no rollback/undeploy stage, because of same tag deployment in the circle', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-6',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v2',
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle1, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentSameTagSameCircleOctopipe)
  })

  it('should create the correct request object with 1 new component and a custom namespace', async() => {

    const activeComponents: Component[] = [
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
          circleId: null,
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(
        deploymentWith1ComponentCircle1CustomNamespace,
        activeComponents,
        { executionId: 'execution-id', incomingCircleId: 'Default' }
      )
    ).toEqual(oneComponentCustomNamespaceOctopipe)
  })

  it('should create the correct request object with 1 new component and EKS configuration', async() => { //TODO EKS

    const activeComponents: Component[] = [
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
          circleId: null,
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle1EKS, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentEKSOctopipe)
  })

  it('should create the correct request object with 1 new component and GENERIC configuration', async() => { //TODO GENERIC

    const activeComponents: Component[] = [
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
          circleId: null,
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
          circleId: null,
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
          circleId: null,
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
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildDeploymentRequest(deploymentWith1ComponentCircle1GENERIC, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneComponentGenericOctopipe)
  })
})
