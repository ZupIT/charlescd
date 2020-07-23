import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../app/app.module'
import { CdConfigurationEntity } from '../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../app/v1/api/configurations/enums'
import { FixtureUtilsService } from '../utils/fixture-utils.service'
import { TestSetupUtils } from '../utils/test-setup-utils'

describe('DeploymentController v2', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app : INestApplication
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
  })

  afterAll(async() => {
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
    // await fixtureUtilsService.loadDatabase()
  })
  it('returns ok for valid params with existing cdConfiguration', async() => {
    const manager = fixtureUtilsService.connection.manager
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await manager.save(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: 'deployment-id',
      circle: {
        headerValue: '123123-4324234-42342-3423'
      },
      modules: [
        {
          moduleId: 'module-id',
          helmRepository: 'https://some-helm.repo',
          components: [
            {
              componentId: '{{componentId}}',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: 'author-id',
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
      deploymentId: 'deployment-id',
      circle: {
        headerValue: '123123-4324234-42342-3423'
      },
      modules: [
        {
          moduleId: 'module-id',
          helmRepository: 'https://some-helm.repo',
          components: [
            {
              componentId: '{{componentId}}',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: 'author-id',
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
            message: 'Configuration with the id 067765f8-aa29-49f7-bf2b-3ec676a71583 was not found',
            statusCode: 404
          })
      })
  })

  it('returns error message for malformed payload', async() => {
    const createDeploymentRequest = {}
    const errorMessages = [
      '"deploymentId" is required',
      '"authorId" is required',
      '"callbackUrl" is required',
      '"cdConfigurationId" is required',
      '"modules" is required'
    ]
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', '12345')
      .expect(422)
      .expect(response => {
        expect(response.body).toEqual({error: 'Unprocessable Entity', message: errorMessages, statusCode: 422})
      })
  })
})
