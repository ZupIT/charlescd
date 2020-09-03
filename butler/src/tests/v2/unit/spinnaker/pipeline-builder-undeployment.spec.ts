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

import { SpinnakerPipelineBuilder } from '../../../../app/v2/core/integrations/spinnaker/pipeline-builder'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import {
  completeSpinnakerUndeploymentPipeline,
  dummyVirtualserviceSpinnakerPipeline, hostnameGatewayUndeploymentPipeline, noRepeatedSubsetUndeploymentPipeline,
  noUnusedSpinnakerUndeploymentPipeline, oneUnusedSpinnakerUndeploymentPipeline
} from './fixtures/undeployment'

const deploymentWith2Components: Deployment = {
  id: 'deployment-id',
  authorId: 'user-1',
  callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
  cdConfiguration: {
    id: 'cd-configuration-id',
    type: CdTypeEnum.SPINNAKER,
    configurationData: {
      gitAccount: 'github-artifact',
      account: 'default',
      namespace: 'sandbox',
      url: 'spinnaker-url'
    },
    name: 'spinnakerconfiguration',
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
      imageUrl: 'https://repository.com/A:v2',
      name: 'A',
      running: false,
      hostValue: null,
      gatewayName: null
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v2',
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
    type: CdTypeEnum.SPINNAKER,
    configurationData: {
      gitAccount: 'github-artifact',
      account: 'default',
      namespace: 'sandbox',
      url: 'spinnaker-url'
    },
    name: 'spinnakerconfiguration',
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
      imageUrl: 'https://repository.com/A:v2',
      name: 'A',
      running: false,
      hostValue: 'host-value-1',
      gatewayName: 'gateway-name-1'
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v2',
      name: 'B',
      running: false,
      hostValue: 'host-value-2',
      gatewayName: 'gateway-name-2'
    }
  ]
}

describe('V2 Spinnaker Undeployment Pipeline Builder', () => {

  it('should create the correct complete pipeline object with 2 components being effectively undeployed', async() => {

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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
        }
      }
    ]

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeSpinnakerUndeploymentPipeline)
  })

  it('should create the correct pipeline object with 2 components being undeployed when no other version is active', async() => {

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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
        }
      }
    ]

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(dummyVirtualserviceSpinnakerPipeline)
  })

  it('should create the correct pipeline object with 2 components being undeployed only in the proxy definitions', async() => {

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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
        }
      }
    ]

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(noUnusedSpinnakerUndeploymentPipeline)
  })

  it('should create the correct pipeline object with 2 components and only one undeployed', async() => {

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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
        }
      }
    ]

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(oneUnusedSpinnakerUndeploymentPipeline)
  })

  it('should create the correct pipeline without repeated destination rules subsets', async() => {

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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
        }
      }
    ]

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(deploymentWith2Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(noRepeatedSubsetUndeploymentPipeline)
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
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
            type: CdTypeEnum.SPINNAKER,
            configurationData: {
              gitAccount: 'github-artifact',
              account: 'default',
              namespace: 'sandbox',
              url: 'spinnaker-url'
            },
            name: 'spinnakerconfiguration',
            authorId: 'user-2',
            workspaceId: 'workspace-id',
            createdAt: new Date(),
            deployments: null
          },
        }
      }
    ]

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(
        deploymentWith2ComponentsHostnameGateway, activeComponents,
        { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(hostnameGatewayUndeploymentPipeline)
  })
})
