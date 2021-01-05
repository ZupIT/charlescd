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

import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import * as http from 'http'
import * as k8s from '@kubernetes/client-node'
import { Component } from '../../../../app/v2/api/deployments/interfaces'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { CrdBuilder } from '../../../../app/v2/core/integrations/k8s/crd-builder'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

const cdConfigurationId = 'cd-configuration-id'
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
      circleId: 'default-circle-id',
      defaultCircle: true,
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
      circleId: 'default-circle-id',
      defaultCircle: true,
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

describe('Routing CRD client apply method', () => {

  let k8sClient: K8sClient

  beforeEach(async() => {
    k8sClient = new K8sClient(new ConsoleLoggerService())
  })

  it('should call the read method with the correct arguments', async() => {
    const readSpy = jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildRoutingCrdManifest(cdConfigurationId, activeComponents)
    await k8sClient.applyRoutingCustomResource(cdConfigurationId, activeComponents)
    expect(readSpy).toHaveBeenCalledWith(expectedManifest)
  })

  it('should call the patch method with the correct arguments', async() => {
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const patchSpy = jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildRoutingCrdManifest(cdConfigurationId, activeComponents)
    await k8sClient.applyRoutingCustomResource(cdConfigurationId, activeComponents)
    expect(patchSpy).toHaveBeenCalledWith(
      expectedManifest,
      undefined,
      undefined,
      undefined,
      undefined,
      { 'headers': { 'Content-type': 'application/merge-patch+json' } }
    )
  })

  it('should throw error when read method fails and should not call patch method', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.reject(expectedError))
    const patchSpy = jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    await expect(k8sClient.applyRoutingCustomResource(cdConfigurationId, activeComponents))
      .rejects.toEqual(expectedError)
    expect(patchSpy).not.toHaveBeenCalled()
  })

  it('should throw error when patch method fails', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.reject(expectedError))

    await expect(k8sClient.applyRoutingCustomResource(cdConfigurationId, activeComponents))
      .rejects.toEqual(expectedError)
  })
})