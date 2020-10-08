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
import { OctopipeRequestBuilder } from '../../../../app/v2/core/integrations/octopipe/request-builder'
import { completeOctopipeUndeploymentRequest } from './fixtures/undeployment/undeploy-complete-pipeline'
import { GitProvidersEnum } from '../../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { dummyVirtualServicePipelineOctopipe } from './fixtures/undeployment/dummy-virtualservice-pipeline'
import { undeploySameTagDiffCirclesUnusedOctopipe } from './fixtures/undeployment/undeploy-same-tag-diff-circles-unused'
import { undeployOneSameTagDiffCirclesUnusedOctopipe } from './fixtures/undeployment/undeploy-one-same-tag-diff-circles-unused'
import { undeployDiffSubsetsSameTagOctopipe } from './fixtures/undeployment/undeploy-diff-subsets-same-tag'
import { undeployHostnameGatewayOctopipe } from './fixtures/undeployment/undeploy-hostname-gateway'
import { completeOctopipeUndeploymentEKSRequest } from './fixtures/undeployment/one-component-eks-config'
import { completeOctopipeUndeploymentGenericRequest } from './fixtures/undeployment/one-component-generic-config'

const deploymentWith2Components: Deployment = {
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
      id: 'component-id-4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      hostValue: null,
      gatewayName: null
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v1',
      name: 'B',
      running: false,
      hostValue: null,
      gatewayName: null
    }
  ]
}

const deploymentWith2ComponentsHostnameGateway: Deployment = {
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
      id: 'component-id-4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      hostValue: 'host-value-1',
      gatewayName: 'gateway-name-1'
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v1',
      name: 'B',
      running: false,
      hostValue: 'host-value-2',
      gatewayName: 'gateway-name-2'
    }
  ]
}

const deploymentWith2ComponentsEKS: Deployment = {
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
      id: 'component-id-4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      hostValue: null,
      gatewayName: null
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v1',
      name: 'B',
      running: false,
      hostValue: null,
      gatewayName: null
    }
  ]
}

const deploymentWith2ComponentsGENERIC: Deployment = {
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
      id: 'component-id-4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      hostValue: null,
      gatewayName: null
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v1',
      name: 'B',
      running: false,
      hostValue: null,
      gatewayName: null
    }
  ]
}

describe('V2 Octopipe Undeployment Request Builder', () => {

  it('should create the correct complete request object with 2 components being effectively undeployed', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeOctopipeUndeploymentRequest)
  })

  it('should create the correct request object with 2 components being undeployed when no other version is active', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
          },
        }
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(dummyVirtualServicePipelineOctopipe)
  })

  it('should create the correct request object with 2 components being undeployed even with same tag in diff circles', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
          },
        }
      },
      {
        id: 'component-id-6',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v0',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(undeploySameTagDiffCirclesUnusedOctopipe)
  })
  
  it('should create the correct request object with 2 components being undeployed, even with one same tag in diff circle', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v0',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(undeployOneSameTagDiffCirclesUnusedOctopipe)
  })

  it('should create the correct pipeline with repeated tags in different subsets', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v0',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        id: 'component-id-9',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(undeployDiffSubsetsSameTagOctopipe)
  })

  it('should create the correct pipeline with custom host name and gateway name', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v0',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        id: 'component-id-9',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v0',
        imageUrl: 'https://repository.com/A:v0',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
      }
    ]

    expect(
      new OctopipeRequestBuilder().buildUndeploymentRequest(
        deploymentWith2ComponentsHostnameGateway, activeComponents,
        { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(undeployHostnameGatewayOctopipe)
  })

  it('should create the correct complete request object with 2 components being undeployed with EKS config', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2ComponentsEKS, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeOctopipeUndeploymentEKSRequest)
  })

  it('should create the correct complete request object with 2 components being undeployed with GENERIC config', async() => {

    const activeComponents: Component[] = [
      {
        id: 'component-id-4',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        }
      },
      {
        id: 'component-id-5',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/B:v1',
        name: 'B',
        running: true,
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
        hostValue: null,
        gatewayName: null,
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
      new OctopipeRequestBuilder().buildUndeploymentRequest(deploymentWith2ComponentsGENERIC, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeOctopipeUndeploymentGenericRequest)
  })
})
