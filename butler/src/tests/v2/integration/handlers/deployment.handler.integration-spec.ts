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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import { JobWithDoneCallback } from 'pg-boss'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v2/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums'
import {
  ComponentEntityV2 as ComponentEntity
} from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { DeploymentHandlerUseCase } from '../../../../app/v2/api/deployments/use-cases/deployment-handler.usecase'
import { ReceiveNotificationUseCase } from '../../../../app/v2/api/deployments/use-cases/receive-notification.usecase'
import express = require('express')
import { SpinnakerConnector } from '../../../../app/v2/core/integrations/spinnaker/connector'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'

let mock = express()

describe('DeploymentHandler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let worker: PgBossWorker
  let deploymentHandler: DeploymentHandlerUseCase
  let manager: EntityManager
  let mockServer: Server
  let notificationUseCase: ReceiveNotificationUseCase
  let spinnakerConnector: SpinnakerConnector

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
    deploymentHandler = app.get<DeploymentHandlerUseCase>(DeploymentHandlerUseCase)
    notificationUseCase = app.get<ReceiveNotificationUseCase>(ReceiveNotificationUseCase)
    spinnakerConnector = app.get<SpinnakerConnector>(SpinnakerConnector)
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
    mock.post('/deploy/notifications/deployment', (req, res) => {
      return res.send({ ok: 'ok' })
    })

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
      callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    const secondDeploymentId = 'a666cbe1-7da3-46a6-bad3-5a3553960f55'

    const firstFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const firstDeployment = firstFixtures.deployment
    const firstExecution = firstFixtures.execution
    const firstJob = firstFixtures.job

    const secondFixtures = await createDeploymentAndExecution({ ...params, deploymentId: secondDeploymentId }, cdConfiguration, manager)
    const secondDeployment = secondFixtures.deployment
    const secondExecution = secondFixtures.execution
    const secondJob = secondFixtures.job

    await deploymentHandler.run(firstJob)
    await deploymentHandler.run(secondJob)

    const handledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })
    const notHandledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: secondDeployment.id } })

    expect(handledDeployment.components.map(c => c.running)).toEqual([true])
    expect(notHandledDeployment.components.map(c => c.running)).toEqual([false])

    await notificationUseCase.execute(firstExecution.id, { status: DeploymentStatusEnum.SUCCEEDED, type: ExecutionTypeEnum.DEPLOYMENT })
    await deploymentHandler.run(secondJob)

    const secondHandled = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: secondDeployment.id } })
    const firstHandled = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })
    expect(secondHandled.components.map(c => c.running)).toEqual([true])
    expect(firstHandled.components.map(c => c.running)).toEqual([false])

    await notificationUseCase.execute(secondExecution.id, { status: DeploymentStatusEnum.SUCCEEDED, type: ExecutionTypeEnum.DEPLOYMENT })

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
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    const firstFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const firstDeployment = firstFixtures.deployment
    const firstJob = firstFixtures.job

    await deploymentHandler.run(firstJob)

    const handledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })

    expect(handledDeployment.components.map(c => c.running)).toEqual([false])
  })

  it('stop the job when the deployment status is flagged as TIMED_OUT', async() => {
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
      deploymentStatus: DeploymentStatusEnum.TIMED_OUT,
      defaultCircle: false
    }

    const fixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)

    await expect(
      deploymentHandler.run(fixtures.job)
    ).rejects.toThrow(new Error('Deployment timed out'))

    const timedOutDeployment = await manager.findOneOrFail(DeploymentEntity, { id: fixtures.deployment.id }, { relations: ['executions'] })
    expect(timedOutDeployment.executions.map(e => e.status)).toEqual([DeploymentStatusEnum.TIMED_OUT])
  })

  it('should pass the correct activeComponents for the deployment method when multiple cdConfigurationIds with active deployments coexist', async() => {
    const cdConfiguration1 = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'namespace1' },
      'config-name',
      'authorId',
      'workspaceId1'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration1)

    const defaultCircleActiveDeploymentDiffCdConfig = new DeploymentEntity(
      'baa226a2-97f1-4e1b-b05a-d758839408f9',
      'user-1',
      '333365f8-bb29-49f7-bf2b-3ec956a71583',
      cdConfiguration1,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/A:v1',
          'A',
          'f1c95177-438c-4c4f-94fd-c207e8d2eb61',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/B:v1',
          'B',
          '1c29210c-e313-4447-80e3-db89b2359138',
          null,
          null
        )
      ],
      true
    )
    defaultCircleActiveDeploymentDiffCdConfig.active = true
    await manager.save(defaultCircleActiveDeploymentDiffCdConfig)

    const cdConfiguration2 = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'namespace2' },
      'config-name',
      'authorId',
      'workspaceId2'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration2)

    const defaultCircleActiveDeploymentSameCdConfig = new DeploymentEntity(
      'f3cb70be-abe6-4efd-ae3e-2081d11c6922',
      'user-1',
      '4d9f61b9-64d0-4425-a9f7-69983c5ce837',
      cdConfiguration2,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/C:v1',
          'C',
          '3fef6041-9aef-4bfd-ad3b-ef20080a23dd',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/D:v1',
          'D',
          'bc0e1fe7-6fc3-402c-9b87-af827bedfc05',
          null,
          null
        )
      ],
      true
    )
    defaultCircleActiveDeploymentSameCdConfig.active = true
    await manager.save(defaultCircleActiveDeploymentSameCdConfig)

    const newDefaultCircleDeployment: DeploymentEntity = await manager.save(new DeploymentEntity(
      '1960773a-63d8-43be-ac77-dbcc8a39cd63',
      'user-1',
      '04310637-3686-4635-b408-4547c722f2d7',
      cdConfiguration2,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/E:v1',
          'E',
          '463e7680-0e59-4bda-9eb6-eb10bb2cdc90',
          null,
          null
        )
      ],
      true
    ))

    const execution : Execution = await manager.save(new Execution(
      newDefaultCircleDeployment,
      ExecutionTypeEnum.DEPLOYMENT,
      'ccc7141b-4d55-4a60-971e-86f3a5a6fb7a',
      DeploymentStatusEnum.CREATED,
    ))

    const executionJob : JobWithDoneCallback<Execution, unknown> = {
      data: execution,
      done: () => ({}),
      id: 'job-id',
      name: 'job-name'
    }

    const createDeploymentSpy = jest.spyOn(spinnakerConnector, 'createDeployment')
    await deploymentHandler.run(executionJob)
    expect(createDeploymentSpy).toHaveBeenCalledWith(
      expect.anything(),
      [
        expect.objectContaining({
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v1',
          imageUrl: 'https://repository.com/D:v1',
          name: 'D',
          componentId: 'bc0e1fe7-6fc3-402c-9b87-af827bedfc05',
          hostValue: null,
          gatewayName: null,
          running: false
        }),
        expect.objectContaining({
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v1',
          imageUrl: 'https://repository.com/C:v1',
          name: 'C',
          componentId: '3fef6041-9aef-4bfd-ad3b-ef20080a23dd',
          hostValue: null,
          gatewayName: null,
          running: false
        }),
      ],
      expect.anything()
    )
  })

  it('should pass the correct activeComponents for the undeployment method when multiple cdConfigurationIds with active deployments coexist', async() => {
    const cdConfiguration1 = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'namespace1' },
      'config-name',
      'authorId',
      'workspaceId1'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration1)

    const defaultCircleActiveDeploymentDiffCdConfig = new DeploymentEntity(
      'baa226a2-97f1-4e1b-b05a-d758839408f9',
      'user-1',
      '333365f8-bb29-49f7-bf2b-3ec956a71583',
      cdConfiguration1,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/A:v1',
          'A',
          'f1c95177-438c-4c4f-94fd-c207e8d2eb61',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/B:v1',
          'B',
          '1c29210c-e313-4447-80e3-db89b2359138',
          null,
          null
        )
      ],
      true
    )
    defaultCircleActiveDeploymentDiffCdConfig.active = true
    await manager.save(defaultCircleActiveDeploymentDiffCdConfig)

    const cdConfiguration2 = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'namespace2' },
      'config-name',
      'authorId',
      'workspaceId2'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration2)

    let defaultCircleActiveDeploymentSameCdConfig = new DeploymentEntity(
      'f3cb70be-abe6-4efd-ae3e-2081d11c6922',
      'user-1',
      '4d9f61b9-64d0-4425-a9f7-69983c5ce837',
      cdConfiguration2,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/C:v1',
          'C',
          '3fef6041-9aef-4bfd-ad3b-ef20080a23dd',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/D:v1',
          'D',
          'bc0e1fe7-6fc3-402c-9b87-af827bedfc05',
          null,
          null
        )
      ],
      true
    )
    defaultCircleActiveDeploymentSameCdConfig.active = true
    defaultCircleActiveDeploymentSameCdConfig = await manager.save(defaultCircleActiveDeploymentSameCdConfig)

    const execution : Execution = await manager.save(new Execution(
      defaultCircleActiveDeploymentSameCdConfig,
      ExecutionTypeEnum.UNDEPLOYMENT,
      'ccc7141b-4d55-4a60-971e-86f3a5a6fb7a',
      DeploymentStatusEnum.CREATED,
    ))

    const executionJob1 : JobWithDoneCallback<Execution, unknown> = {
      data: execution,
      done: () => ({}),
      id: 'job-id1',
      name: 'job-name1'
    }

    const createUndeploymentSpy = jest.spyOn(spinnakerConnector, 'createUndeployment')
    await deploymentHandler.run(executionJob1)
    expect(createUndeploymentSpy).toHaveBeenCalledWith(
      expect.anything(),
      [
        expect.objectContaining({
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v1',
          imageUrl: 'https://repository.com/D:v1',
          name: 'D',
          componentId: 'bc0e1fe7-6fc3-402c-9b87-af827bedfc05',
          hostValue: null,
          gatewayName: null,
          running: false
        }),
        expect.objectContaining({
          helmUrl: 'http://localhost:2222/helm',
          imageTag: 'v1',
          imageUrl: 'https://repository.com/C:v1',
          name: 'C',
          componentId: '3fef6041-9aef-4bfd-ad3b-ef20080a23dd',
          hostValue: null,
          gatewayName: null,
          running: false
        }),
      ],
      expect.anything()
    )
  })
})

const createDeploymentAndExecution = async(params: any, cdConfiguration: CdConfigurationEntity, manager: any) : Promise<{deployment: DeploymentEntity, execution:Execution, job: JobWithDoneCallback<Execution, unknown>  }> => {
  const components = params.components.map((c: any) => {
    return new ComponentEntity(
      c.helmRepository,
      c.buildImageTag,
      c.buildImageUrl,
      c.componentName,
      c.componentId,
      c.hostValue,
      c.gatewayName
    )
  })

  const deployment : DeploymentEntity = await manager.save(new DeploymentEntity(
    params.deploymentId,
    params.authorId,
    params.circle,
    cdConfiguration,
    params.callbackUrl,
    components,
    params.defaultCircle
  ))

  const execution : Execution = await manager.save(new Execution(
    deployment,
    ExecutionTypeEnum.DEPLOYMENT,
    params.incomingCircleId,
    params.deploymentStatus,
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
