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
import { CdConfigurationsRepository } from '../../../../app/v2/api/configurations/repository'
import { ComponentsRepositoryV2 } from '../../../../app/v2/api/deployments/repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { CreateRoutesManifestsUseCase } from '../../../../app/v2/operator/use-cases/create-routes-manifests.usecase'
import { cdConfigurationFixture, deployComponentsFixture, deploymentFixture } from '../../fixtures/deployment-entity.fixture'
import { routesManifests } from '../../fixtures/manifests.fixture'

describe('Hook Routes Manifest Creation', () => {

  const deploymentRepository = new DeploymentRepositoryV2()
  const componentsRepository = new ComponentsRepositoryV2()
  const cdConfigurationsRepository = new CdConfigurationsRepository()
  const consoleLoggerService = new ConsoleLoggerService()

  beforeEach(() => {
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => deploymentFixture)
    jest.spyOn(cdConfigurationsRepository, 'findDecrypted').mockImplementation(async() => cdConfigurationFixture)
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => deployComponentsFixture)
  })

  it('generate route manifest correctly', async() => {
    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    const manifests = await routeUseCase.execute({
      controller: {},
      parent: {
        apiVersion: 'zupit.com/v1',
        kind: 'CharlesDeployment',
        metadata: {},
        spec: {
          circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
          deploymentId: 'b46fd548-0082-4021-ba80-a50703c44a3a',
          components: [
            {
              chat: 'my-chart',
              name: 'my-component',
              tag: 'my-tag'
            }
          ]
        }
      },
      children: {
        'Deployment.apps/v1': {},
        'Service.v1': {}
      },
      finalizing: true
    })

    expect(manifests).toEqual(routesManifests)
  })
})