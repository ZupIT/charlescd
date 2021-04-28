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
import { Deployment } from '../../../../app/v2/api/deployments/interfaces'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import { CrdBuilder } from '../../../../app/v2/core/integrations/k8s/crd-builder'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

const deployment: Deployment = {
  id: 'deployment-id',
  authorId: 'user-1',
  callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
  namespace: 'sandbox',
  defaultCircle: false,
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

describe('Deployment CRD client apply method', () => {

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
    jest.spyOn(k8sClient.client, 'create')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, butlerNamespace)
    Object.assign(expectedManifest.metadata, { labels: { deployment_id: deployment.id } })
    await k8sClient.applyDeploymentCustomResource(deployment)
    expect(readSpy).toHaveBeenCalledWith(expectedManifest)
  })

  it('should call the patch method with the correct arguments and should not call the create method', async() => {
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const patchSpy = jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const createSpy = jest.spyOn(k8sClient.client, 'create')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, butlerNamespace)
    Object.assign(expectedManifest.metadata, { labels: { deployment_id: deployment.id } })
    await k8sClient.applyDeploymentCustomResource(deployment)
    expect(patchSpy).toHaveBeenCalledWith(
      expectedManifest,
      undefined,
      undefined,
      undefined,
      undefined,
      { 'headers': { 'Content-type': 'application/merge-patch+json' } }
    )
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('should call the create method with the correct arguments and should not call the patch method', async() => {
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.reject(new k8s.HttpError({} as http.IncomingMessage, {}, 404)))
    const patchSpy = jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const createSpy = jest.spyOn(k8sClient.client, 'create')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, butlerNamespace)
    Object.assign(expectedManifest.metadata, { labels: { deployment_id: deployment.id } })
    await k8sClient.applyDeploymentCustomResource(deployment)
    expect(createSpy).toHaveBeenCalledWith(expectedManifest)
    expect(patchSpy).not.toHaveBeenCalled()
  })

  it('should throw error when create method fails', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.reject(new k8s.HttpError({} as http.IncomingMessage, {}, 404)))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'create')
      .mockImplementation(() => Promise.reject(expectedError))

    await expect(k8sClient.applyDeploymentCustomResource(deployment))
      .rejects.toEqual(expectedError)
  })

  it('should throw error when patch method fails', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.reject(expectedError))
    jest.spyOn(k8sClient.client, 'create')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    await expect(k8sClient.applyDeploymentCustomResource(deployment))
      .rejects.toEqual(expectedError)
  })

  it('should throw error when read method fails and should not call the create method', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.reject(expectedError))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const createSpy = jest.spyOn(k8sClient.client, 'create')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    await expect(k8sClient.applyDeploymentCustomResource(deployment))
      .rejects.toEqual(expectedError)
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('should call the deployment crd builder method with the correct deployment and namespace', async() => {
    const builderSpy = jest.spyOn(CrdBuilder, 'buildDeploymentCrdManifest')
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'patch')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    await k8sClient.applyDeploymentCustomResource(deployment)
    await expect(builderSpy).toHaveBeenCalledWith(deployment, butlerNamespace)
  })
})
