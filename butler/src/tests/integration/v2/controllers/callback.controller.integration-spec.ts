import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'
import { CreateComponentRequestDto } from '../../../../app/v2/api/deployments/dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../../../../app/v2/api/deployments/dto/create-deployment-request.dto'
import { CreateModuleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-module-request.dto'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { FixtureUtilsService } from '../../utils/fixture-utils.service'
import { TestSetupUtils } from '../../utils/test-setup-utils'
import { EntityManager } from 'typeorm'

describe('DeploymentController v2', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let worker: PgBossWorker
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
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    worker = app.get<PgBossWorker>(PgBossWorker)
    manager = fixtureUtilsService.connection.manager
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
    await worker.pgBoss.stop()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
  })

  it('set deployment callback status and active boolean for success notification', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await manager.save(cdConfiguration)

    const components = new CreateComponentRequestDto(
      '945595ee-d851-4841-a170-c171c0a7b1a2',
      'build-image-url.com',
      'build-image-tag',
      'component-name'
    )

    const modulesDto = new CreateModuleDeploymentDto(
      '6b539c6a-04b2-45c2-8e10-b84cef0e949d',
      'http://helm-repo.com',
      [components]
    )

    const deploymentDto = new CreateDeploymentRequestDto(
      '70faf7b3-5fad-4073-bd9c-da46e60c5d1f',
      'fab07132-13eb-4d6d-8d5d-66f1881e68e5',
      'http://callback-url',
      cdConfiguration.id,
      { headerValue: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5' },
      DeploymentStatusEnum.CREATED,
      [modulesDto]
    )
    const deploymentEntity = deploymentDto.toEntity()
    deploymentEntity.cdConfiguration = cdConfiguration
    deploymentEntity.components[0].running = true
    const savedDeployment = await manager.save(deploymentEntity)
    const deployment = await manager.findOneOrFail(DeploymentEntity, { where: { id: savedDeployment.id }, relations: ['components'] })
    await request(app.getHttpServer())
      .post(`/v2/notifications/deployment/${deployment.id}`)
      .send({ status: 'SUCCEEDED' })
      .set('x-circle-id', '12345')
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual(
          {
            deploymentId: deployment.deploymentId,
            authorId: deployment.authorId,
            status: 'SUCCEEDED',
            circleId: deployment.circleId,
            callbackUrl: deployment.callbackUrl,
            id: deployment.id,
            priority: 0,
            active: true,
            components: [
              {
                componentId: deployment.components[0].componentId,
                helmUrl: deployment.components[0].helmUrl,
                id: deployment.components[0].id,
                imageTag: deployment.components[0].imageTag,
                imageUrl: deployment.components[0].imageUrl,
                name: deployment.components[0].name,
                running: false
              }
            ],
            createdAt: expect.anything(),
            finishedAt: expect.anything()
          }
        )
      })
  })

  it('set deployment callback status for failure callback', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)

    const components = new CreateComponentRequestDto(
      '945595ee-d851-4841-a170-c171c0a7b1a2',
      'build-image-url.com',
      'build-image-tag',
      'component-name'
    )

    const modulesDto = new CreateModuleDeploymentDto(
      '6b539c6a-04b2-45c2-8e10-b84cef0e949d',
      'http://helm-repo.com',
      [components]
    )

    const deploymentDto = new CreateDeploymentRequestDto(
      '70faf7b3-5fad-4073-bd9c-da46e60c5d1f',
      'fab07132-13eb-4d6d-8d5d-66f1881e68e5',
      'http://callback-url',
      cdConfiguration.id,
      { headerValue: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5' },
      DeploymentStatusEnum.CREATED,
      [modulesDto]
    )
    const deploymentEntity = deploymentDto.toEntity()
    deploymentEntity.cdConfiguration = cdConfiguration
    deploymentEntity.components[0].running = true
    const savedDeployment = await manager.save(deploymentEntity)
    const deployment = await manager.findOneOrFail(DeploymentEntity, { where: { id: savedDeployment.id }, relations: ['components'] })
    await request(app.getHttpServer())
      .post(`/v2/notifications/deployment/${deployment.id}`)
      .send({ status: 'FAILED' })
      .set('x-circle-id', '12345')
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual(
          {
            deploymentId: deployment.deploymentId,
            authorId: deployment.authorId,
            status: 'FAILED',
            circleId: deployment.circleId,
            callbackUrl: deployment.callbackUrl,
            id: deployment.id,
            priority: 0,
            active: false,
            components: [
              {
                componentId: deployment.components[0].componentId,
                helmUrl: deployment.components[0].helmUrl,
                id: deployment.components[0].id,
                imageTag: deployment.components[0].imageTag,
                imageUrl: deployment.components[0].imageUrl,
                name: deployment.components[0].name,
                running: false
              }
            ],
            createdAt: expect.anything(),
            finishedAt: expect.anything()
          }
        )
      })
  })
})
