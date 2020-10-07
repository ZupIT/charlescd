/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums/cd-type.enum'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums/deployment-status.enum'
import { CreateCircleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-circle-request.dto'
import { CreateComponentRequestDto } from '../../../../app/v2/api/deployments/dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../../../../app/v2/api/deployments/dto/create-deployment-request.dto'
import { CreateModuleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-module-request.dto'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { SimultaneousDeploymentValidationPipe } from '../../../../app/v2/api/deployments/pipes'
import { FixtureUtilsService } from '../../../v1/integration/utils/fixture-utils.service'
import { TestSetupUtils } from '../../../v1/integration/utils/test-setup-utils'

describe('DeploymentCleanupHandler', () => {
  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let pipe: SimultaneousDeploymentValidationPipe
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
    pipe = app.get<SimultaneousDeploymentValidationPipe>(SimultaneousDeploymentValidationPipe)
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

  it('does not allow simultaneous deployment of same component on a circle when there is an execution with status CREATED', async() => {
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

    await createDeploymentAndExecution(params, fixtureUtilsService, manager, DeploymentStatusEnum.CREATED)
    const createDeploymentDto = createDto(componentName, circleId)

    await expect(
      pipe.transform(createDeploymentDto)
    ).rejects.toThrow(new BadRequestException('Simultaneous deployments are not allowed for a given circle'))

  })


  it('does not allow simultaneous deployment of same component on a default deployment when there is an execution with status CREATED', async() => {
    const circleId = null
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

    await createDeploymentAndExecution(params, fixtureUtilsService, manager, DeploymentStatusEnum.CREATED)
    const createDeploymentDto = createDto(componentName, null)
    await expect(
      pipe.transform(createDeploymentDto)
    ).rejects.toThrow(new BadRequestException('Simultaneous deployments are not allowed for a given circle'))

  })
})


const createDto = (componentName: string, circleId: string | null) => {
  const components = new CreateComponentRequestDto(
    '777765f8-bb29-49f7-bf2b-3ec956a71583',
    'image.url',
    'imageTag',
    componentName,
    undefined,
    undefined
  )

  const modules = new CreateModuleDeploymentDto(
    'acf45587-3684-476a-8e6f-b479820a8cd5',
    'https://some-helm.repo',
    [components]
  )

  const circle = circleId ? new CreateCircleDeploymentDto(circleId) : null

  const createDeploymentDto = new CreateDeploymentRequestDto(
    '28a3f957-3702-4c4e-8d92-015939f39cf2',
    'http://localhost:8883/deploy/notifications/deployment',
    '77777777-3702-4c4e-8d92-015939f39cf2',
    '580a7726-a274-4fc3-9ec1-44e3563d58af',
    circle,
    DeploymentStatusEnum.CREATED,
    [modules]
  )

  return createDeploymentDto
}

const createDeploymentAndExecution = async(params: any, fixtureUtilsService: FixtureUtilsService, manager: any, status: DeploymentStatusEnum): Promise<DeploymentEntity> => {
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
    component.running = true
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

  await manager.save(new Execution(deployment, ExecutionTypeEnum.DEPLOYMENT, null, status))

  return deployment
}
