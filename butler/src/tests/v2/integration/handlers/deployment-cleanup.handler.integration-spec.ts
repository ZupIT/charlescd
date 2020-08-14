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
import { DeploymentCleanupHandler } from '../../../../app/v2/api/deployments/use-cases/deployment-cleanup-handler'
import { FixtureUtilsService } from '../../../v1/integration/utils/fixture-utils.service'
import { TestSetupUtils } from '../../../v1/integration/utils/test-setup-utils'
import express = require('express')
import { ConfigurationConstants } from '../../../../app/v1/core/constants/application/configuration.constants'

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

    const { deployment: timedOutDeployment, job } = await createDeployment(params, cdConfiguration, manager)
    const createdAt = new Date()
    createdAt.setMinutes(createdAt.getMinutes() - ConfigurationConstants.DEPLOYMENT_EXPIRE_TIME)
    await manager.update(DeploymentEntity, { id: timedOutDeployment.id }, { createdAt: createdAt })
    const { deployment: recentDeployment } = await createDeployment(params, cdConfiguration, manager)

    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(200)
    })
    await cleanupHandler.run(job)
    const updatedDeployment = await manager.findOneOrFail(DeploymentEntity, { id: timedOutDeployment.id })
    expect(updatedDeployment.status).toEqual(DeploymentStatusEnum.TIMED_OUT)
    expect(updatedDeployment.notificationStatus).toEqual('SENT')

    const nonUpdatedDeployment = await manager.findOneOrFail(DeploymentEntity, { id: recentDeployment.id })
    expect(nonUpdatedDeployment.status).toEqual(DeploymentStatusEnum.CREATED)
    expect(nonUpdatedDeployment.notificationStatus).toEqual('NOT_SENT')
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
    await manager.update(DeploymentEntity, { id: timedOutDeployment.id }, { createdAt: createdAt })

    mock.post('/deploy/notifications/deployment', (req, res) => {
      res.sendStatus(500)
    })
    await cleanupHandler.run(job)
    const updatedDeployment = await manager.findOneOrFail(DeploymentEntity, { id: timedOutDeployment.id })
    expect(updatedDeployment.status).toEqual(DeploymentStatusEnum.TIMED_OUT)
    expect(updatedDeployment.notificationStatus).toEqual('ERROR')
  })
})


const createDeployment = async(params: any, cdConfiguration: CdConfigurationEntity, manager: any) : Promise<{deployment: DeploymentEntity,  job: JobWithDoneCallback<unknown, unknown>  }> => {
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
    components
  ))

  const job : JobWithDoneCallback<unknown, unknown> = {
    data: {},
    done: () => ({}),
    id: 'job-id',
    name: 'job-name'
  }

  return {
    deployment,
    job
  }
}
