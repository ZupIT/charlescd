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

import { Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { CrdBuilder } from '../../../../app/v2/core/integrations/k8s/crd-builder'
import { expectedDeploymentCrd } from './fixtures/expected-deployment-crd'

it('must generate the correct CharlesDeployment custom resource object', () => {
  const deploymentWith3Components: Deployment = {
    id: 'deployment-id',
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    namespace: 'sandbox',
    defaultCircle: false,
    circleId: 'circle-id',
    createdAt: new Date(),
    components: [
      {
        id: 'component-id-1',
        helmUrl: 'http://localhost:2222/helm1',
        imageTag: 'v1',
        imageUrl: 'https://repository.com/A:v2',
        name: 'A',
        running: false,
        gatewayName: null,
        hostValue: null
      },
      {
        id: 'component-id-2',
        helmUrl: 'http://localhost:2222/helm2',
        imageTag: 'v2',
        imageUrl: 'https://repository.com/B:v2',
        name: 'B',
        running: false,
        gatewayName: null,
        hostValue: null
      },
      {
        id: 'component-id-3',
        helmUrl: 'http://localhost:2222/helm3',
        imageTag: 'v3',
        imageUrl: 'https://repository.com/C:v2',
        name: 'C',
        running: false,
        gatewayName: null,
        hostValue: null
      }
    ]
  }

  expect(
    CrdBuilder.buildDeploymentCrdManifest(deploymentWith3Components, 'namespace')
  ).toEqual(expectedDeploymentCrd)
})
