import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
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
  it('returns ok for valid params with existing cdConfiguration', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: 'https://some-helm.repo',
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment'
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', '12345')
      .expect(201)
  })

  it('returns not found error for valid params without existing cdConfiguration', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: 'https://some-helm.repo',
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: '067765f8-aa29-49f7-bf2b-3ec676a71583',
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment'
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', '12345')
      .expect(404)
      .expect(response => {
        expect(response.body).toEqual(
          {
            error: 'Not Found',
            message: 'CdConfiguration not found - id: 067765f8-aa29-49f7-bf2b-3ec676a71583',
            statusCode: 404
          })
      })
  })

  it('returns error message for malformed payload', async() => {
    const createDeploymentRequest = {}
    const errorMessages = [
      'deploymentId should not be empty',
      'deploymentId must be an UUID',
      'authorId should not be empty',
      'authorId must be an UUID',
      'callbackUrl should not be empty',
      'callbackUrl must be a string',
      'cdConfigurationId should not be empty',
      'cdConfigurationId must be an UUID',
      'modules should not be empty'
    ]
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', '12345')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual({ error: 'Bad Request', message: errorMessages, statusCode: 400 })
      })
  })

  it('create execution for the deployment', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: 'https://some-helm.repo',
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment'
    }
    const response = await request(app.getHttpServer()).post('/v2/deployments').send(createDeploymentRequest).set('x-circle-id', '12345')

    const executionsCount = await manager.findAndCount(Execution)
    expect(executionsCount[1]).toEqual(1)
    const execution = await manager.findOneOrFail(Execution, { relations: ['deployment'] })
    expect(execution.deployment.id).toEqual(response.body.id)
  })

  it('returns error for duplicated componentsName', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: 'https://some-helm.repo',
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            },
            {
              componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment'
    }
    const errorMessages = [
      '0.Duplicated components with the property \'componentName\'',
    ]
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', '12345')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual({ error: 'Bad Request', message: errorMessages, statusCode: 400 })
      })
  })
})
