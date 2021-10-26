/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../app/app.module'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { ReconcileRoutesUsecase } from '../../../../app/v2/operator/use-cases/reconcile-routes.usecase'
import { deploymentFixture, executionFixture } from '../../fixtures/deployment-entity.fixture'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import {
  getSimpleManifests,
  routesManifestsWithoutPreviousDeployment,
  routesManifestsWithPreviousDeployment
} from '../../fixtures/manifests.fixture'
import { RouteHookParams } from '../../../../app/v2/operator/interfaces/params.interface'
import { ComponentsRepositoryV2 } from '../../../../app/v2/api/deployments/repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { UrlConstants } from '../test-constants'
import { EntityManager } from 'typeorm'
import { ExecutionRepository } from '../../../../app/v2/api/deployments/repository/execution.repository'
import { MooveService } from '../../../../app/v2/core/integrations/moove'

describe('Reconcile routes usecase', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let deploymentRepository: DeploymentRepositoryV2
  let componentsRepository: ComponentsRepositoryV2
  let executionRepository: ExecutionRepository
  let mooveService: MooveService
  let consoleLoggerService: ConsoleLoggerService
  let routeUseCase: ReconcileRoutesUsecase
  let hookParamsWith2Components: RouteHookParams
  let manager: EntityManager

  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService,
        DeploymentRepositoryV2
      ]
    })

    app = await TestSetupUtils.createApplication(module)
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    deploymentRepository = app.get<DeploymentRepositoryV2>(DeploymentRepositoryV2)
    componentsRepository = app.get<ComponentsRepositoryV2>(ComponentsRepositoryV2)

    executionRepository = app.get<ExecutionRepository>(ExecutionRepository)
    consoleLoggerService = app.get<ConsoleLoggerService>(ConsoleLoggerService)
    routeUseCase = app.get<ReconcileRoutesUsecase>(ReconcileRoutesUsecase)
    manager = fixtureUtilsService.manager

    hookParamsWith2Components = {
      controller: {},
      parent: {
        apiVersion: 'charlescd.io/v1',
        kind: 'CharlesRoutes',
        metadata: {},
        spec: {
          circles: [
            {
              components: [
                {
                  name: 'A',
                  tag: 'v1'
                }
              ],
              id: '7dedce83-f39d-46d1-98f3-fb9ef3effb05',
              default: true
            },
            {
              components: [
                {
                  name: 'B',
                  tag: 'v1'
                }
              ],
              id: 'ae0f14a5-52d2-4619-af6c-18819aa729fe',
              default: false
            }
          ]
        }
      },
      children: {
        'VirtualService.networking.istio.io/v1alpha3': {},
        'DestinationRule.networking.istio.io/v1alpha3': {}
      },
      finalizing: false
    }
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('Updates the healthy column to true when both VirtualService and DestinationRule for a component is true', async() => {
    deploymentFixture.circleId = 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
    deploymentFixture.current = true
    await deploymentRepository.save(deploymentFixture)
    await executionRepository.save(executionFixture())

    const params = [
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'VirtualService',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'VirtualService',
        status: true
      }
    ]

    const result = await routeUseCase.updateRouteStatus(params)
    expect(result.map(r => r.routed)).toEqual([true])
  })

  it('Updates the healthy column to false when at least one manifest status is false', async() => {
    deploymentFixture.circleId = 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
    deploymentFixture.current = true
    await deploymentRepository.save(deploymentFixture)

    const params = [
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'VirtualService',
        status: false
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'VirtualService',
        status: true
      }
    ]

    const result = await routeUseCase.updateRouteStatus(params)
    expect(result.map(r => r.routed)).toEqual([false])
  })

  it('Updates the healthy column for multiple circles independently', async() => {
    const firstCircleId = 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
    const secondCircleId = 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
    const firstDeployment = deploymentFixture
    const secondDeployment = deploymentFixture

    firstDeployment.circleId = firstCircleId
    await deploymentRepository.save(firstDeployment)
    await executionRepository.save(executionFixture())

    secondDeployment.circleId = secondCircleId
    secondDeployment.id = 'a7d08a07-f29d-452e-a667-7a39820f3262'
    await deploymentRepository.save(secondDeployment)

    const params = [
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'VirtualService',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'VirtualService',
        status: true
      },
      {
        circle: 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'DestinationRule',
        status: false
      },
      {
        circle: 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'VirtualService',
        status: true
      }
    ]

    const result = await routeUseCase.updateRouteStatus(params)
    expect(result.map(r => ({ circle: r.circleId, routed: r.routed }))).toEqual(
      [
        { circle: firstCircleId, routed: true },
        { circle: secondCircleId, routed: false }
      ]
    )
  })

  it('should return the correct desired manifests when a current deployment is not healthy and has a previous', async() => {

    const unhealthyCircleId = '7dedce83-f39d-46d1-98f3-fb9ef3effb05'
    const previousDeployment = new DeploymentEntityV2(
      'dbdc12d0-18e9-490b-9e1c-4a4d4592900d',
      'user-1',
      unhealthyCircleId,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v1',
          'https://repository.com/A:v1',
          'A',
          'd8ab8a99-6113-4705-9f2a-62b53ddb4d36',
          null,
          null,
          getSimpleManifests('A', 'namespace', 'build-image-url.com')
        )
      ],
      false,
      'namespace',
      60
    )
    previousDeployment.current = false
    previousDeployment.healthy = true

    const unhealthyDeployment = new DeploymentEntityV2(
      'bed3dd35-faf4-4afc-9e94-e33f186e648f',
      'user-1',
      unhealthyCircleId,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v2',
          'https://repository.com/A:v2',
          'A',
          'ff83553c-7f58-4ab0-86e2-db57642831c5',
          null,
          null,
          getSimpleManifests('A', 'namespace', 'build-image-url-2.com')
        )
      ],
      false,
      'namespace',
      60
    )
    unhealthyDeployment.current = true
    unhealthyDeployment.healthy = false
    unhealthyDeployment.previousDeploymentId = previousDeployment.id

    const healthyDeploymentDiffCircle = new DeploymentEntityV2(
      'c595eb75-dbf9-44a5-8e6f-c2646fadd641',
      'user-1',
      'ae0f14a5-52d2-4619-af6c-18819aa729fe',
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v1',
          'https://repository.com/B:v1',
          'B',
          'cc374571-885a-4b2c-8911-6a569390ea6d',
          null,
          null,
          getSimpleManifests('B', 'namespace', 'build-image-url.com')
        )
      ],
      false,
      'namespace',
      60
    )
    healthyDeploymentDiffCircle.current = true
    healthyDeploymentDiffCircle.healthy = true

    await manager.save(previousDeployment)
    await manager.save(unhealthyDeployment)
    await manager.save(healthyDeploymentDiffCircle)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsWithPreviousDeployment, resyncAfterSeconds: 5 })
  })

  it('should return the correct desired manifests when a current deployment is not healthy and doesnt have a previous', async() => {

    const unhealthyDeployment = new DeploymentEntityV2(
      'bed3dd35-faf4-4afc-9e94-e33f186e648f',
      'user-1',
      '7dedce83-f39d-46d1-98f3-fb9ef3effb05',
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v2',
          'https://repository.com/A:v2',
          'A',
          'ff83553c-7f58-4ab0-86e2-db57642831c5',
          null,
          null,
          getSimpleManifests('A', 'namespace', 'build-image-url-2.com')
        )
      ],
      false,
      'namespace',
      60
    )
    unhealthyDeployment.current = true
    unhealthyDeployment.healthy = false

    const healthyDeploymentDiffCircle = new DeploymentEntityV2(
      'c595eb75-dbf9-44a5-8e6f-c2646fadd641',
      'user-1',
      'ae0f14a5-52d2-4619-af6c-18819aa729fe',
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v1',
          'https://repository.com/B:v1',
          'B',
          'cc374571-885a-4b2c-8911-6a569390ea6d',
          null,
          null,
          getSimpleManifests('B', 'namespace', 'build-image-url.com')
        )
      ],
      false,
      'namespace',
      60
    )
    healthyDeploymentDiffCircle.current = true
    healthyDeploymentDiffCircle.healthy = true

    await manager.save(unhealthyDeployment)
    await manager.save(healthyDeploymentDiffCircle)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsWithoutPreviousDeployment, resyncAfterSeconds: 5 })
  })
})
