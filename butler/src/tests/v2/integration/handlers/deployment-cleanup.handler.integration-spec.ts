/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import { JobWithDoneCallback } from 'pg-boss'
import { EntityManager, UpdateResult } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { DeploymentCleanupHandler } from '../../../../app/v2/api/deployments/use-cases/deployment-cleanup-handler'
import { FixtureUtilsService } from '../../../v1/integration/utils/fixture-utils.service'
import { TestSetupUtils } from '../../../v1/integration/utils/test-setup-utils'
import express = require('express')
import { ConfigurationConstants } from '../../../../app/v1/core/constants/application/configuration.constants'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'

let mock = express()

describe('DeploymentCleanupHandler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let mockServer: Server
  let cleanupHandler: DeploymentCleanupHandler
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
    cleanupHandler = app.get<DeploymentCleanupHandler>(DeploymentCleanupHandler)
    manager = fixtureUtilsService.connection.manager
  })

  beforeEach(async() => {
    mock = express()
    mockServer = mock.listen(9000)
    await fixtureUtilsService.clearDatabase()
  })

  afterEach(async() => {
    await fixtureUtilsService.clearDatabase()
    mockServer.close()
  })

  it('updates old unresolved deployments', async() => {
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
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af'
    }
    const secondDeploymentId = 'a666cbe1-7da3-46a6-bad3-5a3553960f55'

    const { deployment: timedOutDeployment, job } = await createDeployment(params, cdConfiguration, manager)
    const createdAt = new Date()
    createdAt.setMinutes(createdAt.getMinutes() - ConfigurationConstants.DEPLOYMENT_EXPIRE_TIME)
    await manager.update(Execution, { deploymentId: timedOutDeployment.id }, { createdAt: createdAt })
    const { deployment: recentDeployment } = await createDeployment({ ...params, deploymentId: secondDeploymentId }, cdConfiguration, manager)
    await setComponentsToRunning(timedOutDeployment, manager)

    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(200)
    })
    await cleanupHandler.run(job)
    const updatedExecution = await manager.findOneOrFail(Execution, { deployment: timedOutDeployment }, { relations: ['deployment', 'deployment.components'] })
    expect(updatedExecution.status).toEqual(DeploymentStatusEnum.TIMED_OUT)
    expect(updatedExecution.notificationStatus).toEqual('SENT')
    updatedExecution.deployment.components.map(component => expect(component.running).toEqual(false))

    const nonUpdatedExecution = await manager.findOneOrFail(Execution, { deployment: recentDeployment })
    expect(nonUpdatedExecution.status).toEqual(DeploymentStatusEnum.CREATED)
    expect(nonUpdatedExecution.notificationStatus).toEqual('NOT_SENT')
  })

  it('set deployment notification_status to error when notification fails', async() => {
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
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af'
    }

    const { deployment: timedOutDeployment, job } = await createDeployment(params, cdConfiguration, manager)
    const createdAt = new Date()
    createdAt.setMinutes(createdAt.getMinutes() - ConfigurationConstants.DEPLOYMENT_EXPIRE_TIME)
    await manager.update(Execution, { deploymentId: timedOutDeployment.id }, { createdAt: createdAt })

    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(500)
    })
    await cleanupHandler.run(job)
    const updatedExecution = await manager.findOneOrFail(Execution, { deployment: timedOutDeployment })
    expect(updatedExecution.status).toEqual(DeploymentStatusEnum.TIMED_OUT)
    expect(updatedExecution.notificationStatus).toEqual('ERROR')
  })
})


const setComponentsToRunning = async(deployment: DeploymentEntity, manager: EntityManager): Promise<UpdateResult> => {
  return await manager
    .createQueryBuilder()
    .update(ComponentEntity)
    .set({ running: true })
    .where('deployment_id = :deploymentId', { deploymentId: deployment.id })
    .execute()
}

const createDeployment = async(params: any, cdConfiguration: CdConfigurationEntity, manager: any): Promise<
  {
    deployment: DeploymentEntity,
    job: JobWithDoneCallback<unknown, unknown>,
    execution: Execution
  }> => {
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
    params.circle,
    cdConfiguration,
    params.callbackUrl,
    components
  ))

  const execution: Execution = await manager.save(
    new Execution(
      deployment,
      ExecutionTypeEnum.DEPLOYMENT,
      'incoming',
      DeploymentStatusEnum.CREATED
    )
  )

  const job : JobWithDoneCallback<unknown, unknown> = {
    data: {},
    done: () => ({}),
    id: 'job-id',
    name: 'job-name'
  }

  return {
    deployment,
    job,
    execution
  }
}
