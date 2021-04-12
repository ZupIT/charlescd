import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../app/app.module'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { ReconcileRoutesUsecase } from '../../../../app/v2/operator/use-cases/reconcile-routes.usecase'
import { deploymentFixture } from '../../fixtures/deployment-entity.fixture'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'

describe('Routes manifest use case', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let deploymentRepository: DeploymentRepositoryV2
  let routeUseCase: ReconcileRoutesUsecase

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
    routeUseCase = app.get<ReconcileRoutesUsecase>(ReconcileRoutesUsecase)
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
})
