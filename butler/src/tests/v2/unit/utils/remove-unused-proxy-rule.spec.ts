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

import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums/cd-type.enum'
import { Component } from '../../../../app/v2/api/deployments/interfaces/component.interface'
import { Deployment } from '../../../../app/v2/api/deployments/interfaces/deployment.interface'
import { unusedComponentProxy } from '../../../../app/v2/core/integrations/utils/deployment.utils'

it('should not perform cleanup when no components where overriden', () => {
  const activeComponents = [
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
        circleId: 'circle-id',
        defaultCircle: false,
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

  const deployment = {
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
    circleId: 'another-circle-id',
    defaultCircle: false,
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

  const removedVersions = unusedComponentProxy(deployment, activeComponents)
  expect(removedVersions).toEqual([])

})


it('should not perform cleanup when no new component is deployed', () => {
  const deployment: Deployment = {
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
        defaultCircle: true
      }
    }
  ]
  const removedVersions = unusedComponentProxy(deployment, activeComponents)
  expect(removedVersions.map(c => c.name)).toEqual([])

})
it('should perform override when there is only one component active in circle', () => {
  const deployment: Deployment = {
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
      }
    ]
  }

  const activeComponents: Component[] = [
    {
      id: 'component-id-4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v1',
      name: 'B',
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
        defaultCircle: false
      }
    }
  ]
  const removedVersions = unusedComponentProxy(deployment, activeComponents)
  expect(removedVersions.map(c => c.name)).toEqual(['B'])

})
