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
import { SpinnakerPipelineBuilder } from '../../../../app/v2/core/integrations/spinnaker/pipeline-builder'
import { completeWithOverridesAndDeleteProxy } from './fixtures/deployment/deployment-complete-with-overrides-and-delete-proxy'
import { completeWithOverridesAndDeleteProxyForCircle } from './fixtures/deployment/deployment-complete-with-overrides-and-delete-proxy-circle'


describe('V2 Spinnaker Deployment Pipeline Builder - remove unused proxy rules', () => {

  it('should remove unused deployments, services and istio routes when deploying on same circle but keep the components still in use on default circle', async() => {

    const deploymentWith3Components: Deployment = {
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

    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerDeploymentPipeline(deploymentWith3Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeWithOverridesAndDeleteProxy)
  })
  it('should remove unused deployments, services and istio routes when deploying on same circle', async() => {

    const deploymentWith3Components: Deployment = {
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
      }
    ]
    expect(
      new SpinnakerPipelineBuilder().buildSpinnakerDeploymentPipeline(deploymentWith3Components, activeComponents, { executionId: 'execution-id', incomingCircleId: 'Default' })
    ).toEqual(completeWithOverridesAndDeleteProxyForCircle)
  })
})
