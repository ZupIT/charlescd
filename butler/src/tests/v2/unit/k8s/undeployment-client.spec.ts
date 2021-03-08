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

describe('Undeployment CRD client apply method', () => {

  let k8sClient: K8sClient
  const butlerNamespace = 'butler-namespace'

  beforeEach(async() => {
    k8sClient = new K8sClient(new ConsoleLoggerService(), { butlerNamespace: butlerNamespace } as IEnvConfiguration)
  })

  it('should call the read method with the correct arguments', async() => {
    const readSpy = jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'delete')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, butlerNamespace)
    await k8sClient.applyUndeploymentCustomResource(deployment)
    expect(readSpy).toHaveBeenCalledWith(expectedManifest)
  })

  it('should call the delete method with the correct arguments', async() => {
    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    const deleteSpy = jest.spyOn(k8sClient.client, 'delete')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const expectedManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, butlerNamespace)
    await k8sClient.applyUndeploymentCustomResource(deployment)
    expect(deleteSpy).toHaveBeenCalledWith(expectedManifest)
  })

  it('should throw error when read method fails and should not call the delete method', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.reject(expectedError))
    const deleteSpy = jest.spyOn(k8sClient.client, 'delete')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    await expect(k8sClient.applyUndeploymentCustomResource(deployment))
      .rejects.toEqual(expectedError)
    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it('should throw error when delete method fails', async() => {
    const expectedError = new k8s.HttpError({} as http.IncomingMessage, {}, 500)

    jest.spyOn(k8sClient.client, 'read')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))
    jest.spyOn(k8sClient.client, 'delete')
      .mockImplementation(() => Promise.reject(expectedError))

    await expect(k8sClient.applyUndeploymentCustomResource(deployment))
      .rejects.toEqual(expectedError)
  })
})
