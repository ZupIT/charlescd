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
import { Component } from '../../../../app/v2/api/deployments/interfaces'
import { CrdBuilder } from '../../../../app/v2/core/integrations/k8s/crd-builder'
import { expectedRouteCrd } from './fixtures/expected-route-crd'

it('must generate the correct CharlesRoutes custom resource object', () => {
  const activeComponents: Component[] = [
    {
      id: 'component-id3',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/A:v2',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id2',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
        circleId: 'circle-id-1',
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
      id: 'component-id4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v3',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
        circleId: 'circle-id-2',
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
      id: 'component-id5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/B:v2',
      name: 'B',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
        circleId: 'circle-id-1',
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
      id: 'component-id6',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v3',
      imageUrl: 'https://repository.com/B:v3',
      name: 'B',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
        circleId: 'circle-id-2',
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
      id: 'component-id7',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v4',
      imageUrl: 'https://repository.com/B:v3',
      name: 'C',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
        circleId: 'circle-id-3',
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

  expect(
    CrdBuilder.buildRoutingCrdManifest('namespace', activeComponents)
  ).toEqual(expectedRouteCrd)
})
