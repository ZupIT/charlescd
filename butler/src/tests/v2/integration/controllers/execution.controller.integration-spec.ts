/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { FixtureUtilsService } from '../../../v1/integration/utils/fixture-utils.service'
import { TestSetupUtils } from '../../../v1/integration/utils/test-setup-utils'

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
    await worker.pgBoss.start()
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
  })

  it('returns ok for valid params with existing cdConfiguration', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
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

    const firstExecution = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const secondExecution = await createDeploymentAndExecution({ ...params, deploymentId: 'a33365f8-bb29-49f7-bf2b-3ec956a71583' }, cdConfiguration, manager)
    const thirdExecution = await createDeploymentAndExecution({ ...params, deploymentId: 'b33365f8-bb29-49f7-bf2b-3ec956a71583' }, cdConfiguration, manager)

    await request(app.getHttpServer())
      .get('/v2/executions').query({ active: false, size: 1, page: 1 })
      .set('x-circle-id', '12345')
      .expect(200)
      .expect(response => {
        expect(response.body.executions.length).toEqual(1)
        expect(response.body.executions[0].id).toEqual(thirdExecution.id)
        expect(response.body.page).toEqual(0)
        expect(response.body.size).toEqual(1)
        expect(response.body.totalPages).toEqual(3)
        expect(response.body.last).toEqual(false)
      })

    // testing pagination
    await request(app.getHttpServer())
      .get('/v2/executions')
      .query({ active: false, size: 1, page: 2 })
      .set('x-circle-id', '12345')
      .expect(200)
      .expect(response => {
        expect(response.body.executions.length).toEqual(1)
        expect(response.body.executions[0].id).toEqual(secondExecution.id)
        expect(response.body.page).toEqual(1)
        expect(response.body.size).toEqual(1)
        expect(response.body.totalPages).toEqual(3)
        expect(response.body.last).toEqual(false)
      })

    // testing pagination
    await request(app.getHttpServer())
      .get('/v2/executions')
      .query({ active: false, size: 1, page: 3 })
      .set('x-circle-id', '12345')
      .expect(200)
      .expect(response => {
        expect(response.body.executions.length).toEqual(1)
        expect(response.body.executions[0].id).toEqual(firstExecution.id)
        expect(response.body.page).toEqual(2)
        expect(response.body.size).toEqual(1)
        expect(response.body.totalPages).toEqual(3)
        expect(response.body.last).toEqual(true)
      })
  })
})

const createDeploymentAndExecution = async(params: any, cdConfiguration: CdConfigurationEntity, manager: any) : Promise<Execution> => {
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

  const execution : Execution = await manager.save(new Execution(
    deployment,
    ExecutionTypeEnum.DEPLOYMENT,
    params.incomingCircleId,
    params.deploymentStatus,
  ))
  return execution
}
