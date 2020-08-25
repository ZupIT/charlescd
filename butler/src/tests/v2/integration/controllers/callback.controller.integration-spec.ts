import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import * as request from 'supertest'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'
import { CreateComponentRequestDto } from '../../../../app/v2/api/deployments/dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../../../../app/v2/api/deployments/dto/create-deployment-request.dto'
import { CreateModuleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-module-request.dto'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { FixtureUtilsService } from '../../../v1/integration/utils/fixture-utils.service'
import { TestSetupUtils } from '../../../v1/integration/utils/test-setup-utils'
import express = require('express')
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { DateUtils } from '../../../../app/v2/core/utils/date.utils'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'

let mock = express()

describe('CallbackController v2', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let mockServer: Server
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
    mock = express()
    mockServer = mock.listen(9000)
    await worker.pgBoss.start()
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
  })

  afterEach(async() => {
    await fixtureUtilsService.clearDatabase()
    mockServer.close()
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
      'http://localhost:9000/deploy/notifications/deployment',
      cdConfiguration.id,
      { headerValue: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5' },
      DeploymentStatusEnum.CREATED,
      [modulesDto]
    )
    const deploymentEntity = deploymentDto.toCircleEntity()
    deploymentEntity.cdConfiguration = cdConfiguration
    deploymentEntity.components[0].running = true
    const savedDeployment = await manager.save(deploymentEntity)
    const execution = await manager.save(
      new Execution(
        savedDeployment,
        ExecutionTypeEnum.DEPLOYMENT,
        '7a648c6a-04b2-45c2-8e10-b84cef0e949d',
        DeploymentStatusEnum.CREATED
      )
    )
    const deployment = await manager.findOneOrFail(DeploymentEntity, { where: { id: savedDeployment.id }, relations: ['components'] })

    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(200)
    })

    const expectedResponse = {
      deployment: {
        id: deployment.id,
        authorId: 'fab07132-13eb-4d6d-8d5d-66f1881e68e5',
        circleId: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5',
        callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
        components: [
          {
            helmUrl: 'http://helm-repo.com',
            imageTag: 'build-image-tag',
            imageUrl: 'build-image-url.com',
            name: 'component-name',
            componentId: '945595ee-d851-4841-a170-c171c0a7b1a2',
            merged: false,
            id: deployment.components[0].id,
            running: false
          }
        ],
        createdAt: expect.anything(),
        priority: 0,
        active: true
      },
      type: 'DEPLOYMENT',
      incomingCircleId: '7a648c6a-04b2-45c2-8e10-b84cef0e949d',
      status: 'SUCCEEDED',
      id: execution.id,
      notificationStatus: 'SENT',
      deploymentId: '70faf7b3-5fad-4073-bd9c-da46e60c5d1f',
      createdAt: expect.anything(),
      finishedAt: expect.anything()
    }

    await request(app.getHttpServer())
      .post(`/v2/executions/${execution.id}/notify`)
      .send({ status: 'SUCCEEDED', type: 'DEPLOYMENT' })
      .set('x-circle-id', '12345')
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual(expectedResponse)
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
      'http://localhost:9000/deploy/notifications/deployment',
      cdConfiguration.id,
      { headerValue: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5' },
      DeploymentStatusEnum.CREATED,
      [modulesDto]
    )
    const deploymentEntity = deploymentDto.toCircleEntity()
    deploymentEntity.cdConfiguration = cdConfiguration
    deploymentEntity.components[0].running = true
    const savedDeployment = await manager.save(deploymentEntity)
    const deployment = await manager.findOneOrFail(DeploymentEntity, { where: { id: savedDeployment.id }, relations: ['components'] })

    const execution = await manager.save(
      new Execution(
        savedDeployment,
        ExecutionTypeEnum.DEPLOYMENT,
        '7a648c6a-04b2-45c2-8e10-b84cef0e949d',
        DeploymentStatusEnum.CREATED
      )
    )

    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(200)
    })

    const expectedResponse = {
      deployment: {
        id: deployment.id,
        authorId: 'fab07132-13eb-4d6d-8d5d-66f1881e68e5',
        circleId: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5',
        callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
        components: [
          {
            helmUrl: 'http://helm-repo.com',
            imageTag: 'build-image-tag',
            imageUrl: 'build-image-url.com',
            name: 'component-name',
            componentId: '945595ee-d851-4841-a170-c171c0a7b1a2',
            merged: false,
            id: deployment.components[0].id,
            running: false
          }
        ],
        createdAt: expect.anything(),
        priority: 0,
        active: false
      },
      type: 'DEPLOYMENT',
      incomingCircleId: '7a648c6a-04b2-45c2-8e10-b84cef0e949d',
      status: 'FAILED',
      id: execution.id,
      notificationStatus: 'SENT',
      deploymentId: '70faf7b3-5fad-4073-bd9c-da46e60c5d1f',
      createdAt: expect.anything(),
      finishedAt: expect.anything()
    }

    await request(app.getHttpServer())
      .post(`/v2/executions/${execution.id}/notify`)
      .send({ status: 'FAILED', type: 'DEPLOYMENT' })
      .set('x-circle-id', '12345')
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual(expectedResponse)
      })
  })

  it('set undeployment callback status to inactive for success notification', async() => {
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
      'http://localhost:9000/deploy/notifications/deployment',
      cdConfiguration.id,
      { headerValue: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5' },
      DeploymentStatusEnum.SUCCEEDED,
      [modulesDto]
    )
    const deploymentEntity = deploymentDto.toCircleEntity()
    deploymentEntity.active = true
    deploymentEntity.cdConfiguration = cdConfiguration
    const savedDeployment = await manager.save(deploymentEntity)
    const executionEntity = new Execution(
      savedDeployment,
      ExecutionTypeEnum.UNDEPLOYMENT,
      '7a648c6a-04b2-45c2-8e10-b84cef0e949d',
      DeploymentStatusEnum.SUCCEEDED,
    )
    executionEntity.finishedAt = DateUtils.now()
    await manager.update(ComponentEntityV2, { deployment: savedDeployment }, { running: true })
    const savedExecution = await manager.save(executionEntity)

    const execution = await manager.findOneOrFail(Execution, { id: savedExecution.id }, { relations: ['deployment', 'deployment.components'] })
    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(200)
    })

    const expectedResponse = {
      deployment: {
        id: execution.deployment.id,
        authorId: 'fab07132-13eb-4d6d-8d5d-66f1881e68e5',
        circleId: 'bab07132-13eb-4d6d-8d5d-66f1881e68e5',
        callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
        components: [
          {
            helmUrl: 'http://helm-repo.com',
            imageTag: 'build-image-tag',
            imageUrl: 'build-image-url.com',
            name: 'component-name',
            componentId: '945595ee-d851-4841-a170-c171c0a7b1a2',
            merged: false,
            id: execution.deployment.components[0].id,
            running: false
          }
        ],
        createdAt: expect.anything(),
        priority: 0,
        active: false
      },
      type: 'UNDEPLOYMENT',
      incomingCircleId: '7a648c6a-04b2-45c2-8e10-b84cef0e949d',
      status: 'SUCCEEDED',
      id: execution.id,
      notificationStatus: 'SENT',
      deploymentId: '70faf7b3-5fad-4073-bd9c-da46e60c5d1f',
      createdAt: expect.anything(),
      finishedAt: expect.anything()
    }

    await request(app.getHttpServer())
      .post(`/v2/executions/${execution.id}/notify`)
      .send({ status: 'SUCCEEDED', type: 'UNDEPLOYMENT' })
      .set('x-circle-id', '12345')
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual(expectedResponse)
      })


  })
})
