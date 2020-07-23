import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../app/app.module'
import { FixtureUtilsService } from '../utils/fixture-utils.service'
import { TestSetupUtils } from '../utils/test-setup-utils'
import { INestApplication } from '@nestjs/common'

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
    const createDeploymentRequest = {
      deploymentId: '5ba3691b-d647-4a36-9f6d-c089f114e476',
      applicationName: 'c26fbf77-5da1-4420-8dfa-4dea235a9b1e',
      modules: [
        {
          moduleId: 'e2c937cb-d77e-48db-b1ea-7d3df16fd02c',
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: 'c41f029d-186c-4097-ad43-1b344b2e8041',
              componentName: 'component-name',
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            },
            {
              componentId: 'f4c4bcbe-58a9-41cc-ad8b-7177121905de',
              componentName: 'component-name2',
              buildImageUrl: 'image-url2',
              buildImageTag: 'image-tag2'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      circle: {
        headerValue: 'circle-header'
      }
    }
    await request(app.getHttpServer()).post('/v2/deployments').send(createDeploymentRequest).set('x-circle-id', '12345').expect(201)
  })

  it('returns error message for malformed payload', async() => {
    const createDeploymentRequest = {}
    await request(app.getHttpServer()).post('/v2/deployments').send(createDeploymentRequest).set('x-circle-id', '12345').expect(422)
  })
})
