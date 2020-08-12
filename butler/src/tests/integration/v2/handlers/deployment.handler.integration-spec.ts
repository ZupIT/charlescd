/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import { JobWithDoneCallback } from 'pg-boss'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { DeploymentHandler } from '../../../../app/v2/api/deployments/use-cases/deployment-handler'
import { NotificationUseCase } from '../../../../app/v2/api/deployments/use-cases/notification-use-case'
import { DateUtils } from '../../../../app/v2/core/utils/date.utils'
import { FixtureUtilsService } from '../../utils/fixture-utils.service'
import { TestSetupUtils } from '../../utils/test-setup-utils'
import express = require('express')

let mock = express()

describe('DeploymentHandler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let worker: PgBossWorker
  let deploymentHandler: DeploymentHandler
  let manager: EntityManager
  let mockServer: Server
  let notificationUseCase: NotificationUseCase
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
    deploymentHandler = app.get<DeploymentHandler>(DeploymentHandler)
    notificationUseCase = app.get<NotificationUseCase>(NotificationUseCase)
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
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.start()
    await worker.pgBoss.clearStorage()
  })

  afterEach(() => {
    mockServer.close()
  })

  it('set only one component deployment status to running, set the second to running when the first is finished', async() => {
    mock.post('/ok/tasks', (req, res) => {
      res.sendStatus(200)
    })

    mock.get('/ok/applications/:app/pipelineConfigs/:cdConfig', (req, res) => {
      res.send({ id: '123123123123' })
    })

    mock.post('/ok/pipelines/:app/:pipeline', (req, res) => {
      res.send({ id: '123123123123' })
    })

    mock.post('/ok/pipelines', (req, res) => {
      res.send({ ok: '???' })
    })

    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30'
    }

    const firstFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const firstDeployment = firstFixtures.deployment
    const firstJob = firstFixtures.job

    const secondFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const secondDeployment = secondFixtures.deployment
    const secondJob = secondFixtures.job

    await deploymentHandler.run(firstJob)
    await deploymentHandler.run(secondJob)

    const handledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })
    const notHandledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: secondDeployment.id } })

    expect(handledDeployment.components.map(c => c.running)).toEqual([true])
    expect(notHandledDeployment.components.map(c => c.running)).toEqual([false])

    await notificationUseCase.handleCallback(firstDeployment.id, DeploymentStatusEnum.SUCCEEDED)
    await deploymentHandler.run(secondJob)

    const secondHandled = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: secondDeployment.id } })
    const firstHandled = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })
    expect(secondHandled.components.map(c => c.running)).toEqual([true])
    expect(firstHandled.components.map(c => c.running)).toEqual([false])

    await notificationUseCase.handleCallback(secondDeployment.id, DeploymentStatusEnum.SUCCEEDED)

    const secondsStopped = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: secondHandled.id } })
    const firstStopped = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstHandled.id } })

    expect(secondsStopped.components.map(c => c.running)).toEqual([false])
    expect(firstStopped.components.map(c => c.running)).toEqual([false])
  })

  it('dont set components to running if CD returns an error', async() => {
    mock.post('/error/tasks', (req, res) => {
      res.sendStatus(500)
    })

    mock.get('/error/applications/:app/pipelineConfigs/:cdConfig', (req, res) => {
      res.send({ id: '123123123123' })
    })

    mock.post('/error/pipelines/:app/:pipeline', (req, res) => {
      res.send({ id: '123123123123' })
    })

    mock.post('/error/pipelines', (req, res) => {
      res.send({ ok: '???' })
    })

    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/error', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30'
    }

    const firstFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const firstDeployment = firstFixtures.deployment
    const firstJob = firstFixtures.job

    await deploymentHandler.run(firstJob)

    const handledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })

    expect(handledDeployment.components.map(c => c.running)).toEqual([false])
  })

  it('mark the deployment as timed out after 25 minutes', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment'
    }

    const fixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() =>
      new Date('2019-05-14T11:00:00.135Z').valueOf()
    )
    manager.update(DeploymentEntity, { id: fixtures.deployment.id }, { createdAt: DateUtils.now() })

    jest.spyOn(global.Date, 'now').mockImplementationOnce(() =>
      new Date('2019-05-14T11:26:00.135Z').valueOf()
    )
    await expect(
      deploymentHandler.run(fixtures.job)
    ).rejects.toThrow(new Error('Deployment timed out'))

    const timedOutDeployment = await manager.findOneOrFail(DeploymentEntity, { id: fixtures.deployment.id })
    expect(timedOutDeployment.status).toEqual(DeploymentStatusEnum.TIMED_OUT)
  })
})

const createDeploymentAndExecution = async(params: any, cdConfiguration: CdConfigurationEntity, manager: any) : Promise<{deployment: DeploymentEntity, execution:Execution, job: JobWithDoneCallback<Execution, unknown>  }> => {
  const components = params.components.map((c: any) => {
    return new ComponentEntity(
      c.helmRepository,
      c.buildImageTag,
      c.buildImageUrl,
      c.componentName,
      c.componentId)
  })

  const deployment : DeploymentEntity = await manager.save(new DeploymentEntity(
    params.deploymentId,
    params.authorId,
    DeploymentStatusEnum.CREATED,
    params.circle,
    cdConfiguration,
    params.callbackUrl,
    components,
    params.incomingCircleId
  ))

  const execution : Execution = await manager.save(new Execution(
    deployment,
    'DEPLOYMENT'
  ))

  const job : JobWithDoneCallback<Execution, unknown> = {
    data: execution,
    done: () => ({}),
    id: 'job-id',
    name: 'job-name'
  }

  return {
    deployment,
    execution,
    job
  }
}
