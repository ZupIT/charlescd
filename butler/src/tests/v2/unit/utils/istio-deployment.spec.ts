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

import { IstioDeploymentManifestsUtils } from '../../../../app/v2/core/integrations/utils/istio-deployment-manifests.utils'
import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { twoSubsetsDr } from './fixtures/deployment/two-subsets-dr'
import { DeploymentComponent } from 'src/app/v2/api/deployments/interfaces/deployment.interface'

it('must not insert two default circle subsets', () => {
  const newComponent: DeploymentComponent = {
    id: 'component-id',
    helmUrl: 'http://localhost:2222/helm',
    imageTag: 'v1',
    imageUrl: 'https://repository.com/A:v1',
    name: 'A',
    running: false,
    gatewayName: null,
    hostValue: null
  }
  const deployment: Deployment = {
    id: 'deployment-id',
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    circleId: 'default-circle-id',
    defaultCircle: true,
    metadata: null,
    createdAt: new Date(),
    components: [
      newComponent
    ]
  }
  it('should generate the correct destination rules manifest with one circle and one default circle subset', () => {
    const activeByName: Component[] = [
      {
        id: 'component-id',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: false,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id1',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
          circleId: 'default-circle-id',
          createdAt: new Date(),
          defaultCircle: true,
          metadata: null,
        }
      },
      {
        id: 'component-id3',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v1',
        name: 'A',
        running: false,
        gatewayName: null,
        hostValue: null,
        deployment: {
          id: 'deployment-id',
          authorId: 'user-1',
          callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
          circleId: 'normal-circle-id',
          createdAt: new Date(),
          defaultCircle: false,
          metadata: null,
        }
      }
    ]

    expect(
      IstioDeploymentManifestsUtils.getDestinationRulesManifest('A', 'sandbox', activeByName)
    ).toEqual(twoSubsetsDr)
  })

  it('must not insert two subsets for the same circle', () => {
    const newComponent: DeploymentComponent = {
      id: 'component-id',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null
    }
    const deployment: Deployment = {
      id: 'deployment-id',
      authorId: 'user-1',
      callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
      circleId: 'normal-circle-id',
      defaultCircle: true,
      metadata: null,
      createdAt: new Date(),
      components: [
        newComponent
      ]
    }
    const activeByName: Component[] = [
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
          circleId: 'default-circle-id',
          createdAt: new Date(),
          defaultCircle: true,
          metadata: null,
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
          circleId: 'normal-circle-id',
          createdAt: new Date(),
          defaultCircle: false,
          metadata: null
        }
      }
    ]
  })
})
// TODO generate destination rules with empty subsets

// TODO generate correct virtual services

// TODO generate virtual services with empty rules