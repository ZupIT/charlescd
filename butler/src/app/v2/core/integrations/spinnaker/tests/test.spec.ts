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
import { Component, Deployment } from '../interfaces'
import { SpinnakerConnector } from '../connector'
import { DeploymentStatusEnum } from '../../../../../v1/api/deployments/enums'
import { spinnakerPipeline } from './pipeline-object'
import { CdTypeEnum } from '../../../../../v1/api/configurations/enums'

describe('V2 Spinnaker Connector', () => {
  it('should create the correct pipeline object', async() => {

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
      circleId: 'circle-id',
      createdAt: new Date(),
      finishedAt: null,
      status: DeploymentStatusEnum.CREATED,
      components: [
        {
          id: 'component-id-1',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/A:v2',
          name: 'A',
          running: false
        },
        {
          id: 'component-id-2',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/B:v2',
          name: 'B',
          running: false
        },
        {
          id: 'component-id-3',
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v2',
          imageUrl: 'https://repository.com/C:v2',
          name: 'C',
          running: false
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
        deployment: {
          id: 'deployment-id4',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
          circleId: 'circle-id',
          createdAt: new Date(),
          finishedAt: new Date(),
          status: DeploymentStatusEnum.SUCCEEDED,
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
        deployment: {
          id: 'deployment-id5',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
          circleId: 'circle-id',
          createdAt: new Date(),
          finishedAt: new Date(),
          status: DeploymentStatusEnum.SUCCEEDED,
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
        deployment: {
          id: 'deployment-id6',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: null,
          createdAt: new Date(),
          finishedAt: new Date(),
          status: DeploymentStatusEnum.SUCCEEDED,
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
        deployment: {
          id: 'deployment-id7',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=7',
          circleId: null,
          createdAt: new Date(),
          finishedAt: new Date(),
          status: DeploymentStatusEnum.SUCCEEDED,
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
        deployment: {
          id: 'deployment-id8',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=8',
          circleId: null,
          createdAt: new Date(),
          finishedAt: new Date(),
          status: DeploymentStatusEnum.SUCCEEDED,
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

    expect(new SpinnakerConnector().buildSpinnakerPipeline(deployment, activeComponents)).toBe(spinnakerPipeline)
  })
})
