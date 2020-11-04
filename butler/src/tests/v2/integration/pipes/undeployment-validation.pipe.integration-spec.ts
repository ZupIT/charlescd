/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums/cd-type.enum'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums/deployment-status.enum'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { UndeploymentValidation } from '../../../../app/v2/api/deployments/pipes/undeployment-validation.pipe'
import { FixtureUtilsService } from '../../../v1/integration/utils/fixture-utils.service'
import { TestSetupUtils } from '../../../v1/integration/utils/test-setup-utils'

describe('DeploymentCleanupHandler', () => {
  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let pipe: UndeploymentValidation
  let manager: EntityManager
  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService
      ]
    })
    app = await TestSetupUtils.createApplication(module)
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    pipe = app.get<UndeploymentValidation>(UndeploymentValidation)
    manager = fixtureUtilsService.connection.manager
    TestSetupUtils.seApplicationConstants()
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('returns not found error when trying to undeploy non existing deployment', async() => {
    const nonExistingDeploymentId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const errorMessage =
    `Could not find any entity of type "DeploymentEntityV2" matching: {
    "id": "333365f8-bb29-49f7-bf2b-3ec956a71583"
}`

    await expect(
      pipe.transform(nonExistingDeploymentId)
    ).rejects.toThrow(new BadRequestException(errorMessage))

  })

  it('returns error message when trying to undeploy not active deployment', async() => {
    const circleId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const componentName = 'component-name'

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: circleId,
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af'
    }

    const deployment = await createDeploymentAndExecution(params, fixtureUtilsService, manager, false, false)
    await expect(
      pipe.transform(deployment.id)
    ).rejects.toThrow(new BadRequestException('Cannot undeploy not active deployment'))
  })

  it('allows undeployment of active deployment', async() => {
    const circleId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const componentName = 'component-name'

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: circleId,
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af'
    }

    const deployment = await createDeploymentAndExecution(params, fixtureUtilsService, manager, true, false)
    expect(await pipe.transform(deployment.id)).toEqual(deployment.id)
  })

})

const createDeploymentAndExecution = async(params: any, fixtureUtilsService: FixtureUtilsService, manager: any, status: boolean, running: boolean): Promise<DeploymentEntity> => {
  const components = params.components.map((c: any) => {
    const component = new ComponentEntity(
      c.helmRepository,
      c.buildImageTag,
      c.buildImageUrl,
      c.componentName,
      c.componentId,
      c.hostValue,
      c.gatewayName
    )
    component.running = running
    return component
  })

  const configEntity = new CdConfigurationEntity(
    CdTypeEnum.SPINNAKER,
    { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'my-namespace' },
    'config-name',
    'authorId',
    'workspaceId'
  )
  const cdConfiguration = await fixtureUtilsService.createEncryptedConfiguration(configEntity)

  const deployment : DeploymentEntity = await manager.save(new DeploymentEntity(
    params.deploymentId,
    params.authorId,
    params.circle,
    cdConfiguration,
    params.callbackUrl,
    components
  ))

  deployment.active = status

  await manager.update(DeploymentEntity, { id: deployment.id }, { active: status })

  await manager.save(new Execution(deployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.SUCCEEDED))

  return deployment
}
