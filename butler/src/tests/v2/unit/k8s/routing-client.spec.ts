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

import * as k8s from '@kubernetes/client-node'
import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import * as http from 'http'
import { Component } from '../../../../app/v2/api/deployments/interfaces'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import { CrdBuilder } from '../../../../app/v2/core/integrations/k8s/crd-builder'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

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
      namespace: 'sandbox',
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
      namespace: 'sandbox',
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
      namespace: 'sandbox'
    }
  }
]

describe('Routing CRD client apply method', () => {

  let k8sClient: K8sClient
  const butlerNamespace = 'butler-namespace'

  beforeEach(async() => {
    k8sClient = new K8sClient(new ConsoleLoggerService(), { butlerNamespace: butlerNamespace } as IEnvConfiguration)
  })

  it('should call the read method with the correct arguments', async() => {
    const readSpy = jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildRoutingCrdManifest(activeComponents, butlerNamespace)
    await k8sClient.applyRoutingCustomResource(activeComponents)
    expect(readSpy).toHaveBeenCalledWith(expectedManifest)
  })

  it('should call the patch method with the correct arguments', async() => {
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const patchSpy = jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildRoutingCrdManifest(activeComponents, butlerNamespace)
    await k8sClient.applyRoutingCustomResource(activeComponents)
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

    await expect(k8sClient.applyRoutingCustomResource(activeComponents))
      .rejects.toEqual(expectedError)
    expect(patchSpy).not.toHaveBeenCalled()
  })

  it('should throw error when patch method fails', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.reject(expectedError))

    await expect(k8sClient.applyRoutingCustomResource(activeComponents))
      .rejects.toEqual(expectedError)
  })

  it('should call the routing crd builder method with the correct activeComponents and namespace', async() => {
    const builderSpy = jest.spyOn(CrdBuilder, 'buildRoutingCrdManifest')
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    await k8sClient.applyRoutingCustomResource(activeComponents)
    expect(builderSpy).toHaveBeenCalledWith(activeComponents, butlerNamespace)
  })
})
