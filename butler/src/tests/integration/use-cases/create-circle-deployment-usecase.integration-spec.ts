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
import { Test } from '@nestjs/testing'
import { HttpService, INestApplication } from '@nestjs/common'
import { FixtureUtilsService } from '../utils/fixture-utils.service'
import { AppModule } from '../../../app/app.module'
import * as request from 'supertest'
import { TestSetupUtils } from '../utils/test-setup-utils'
import { DeploymentEntity, ModuleDeploymentEntity } from '../../../app/v1/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../app/v1/api/deployments/enums'
import { QueuedDeploymentsRepository } from '../../../app/v1/api/deployments/repository'
import { ComponentEntity } from '../../../app/v1/api/components/entity'
import { IoCTokensConstants } from '../../../app/v1/core/constants/ioc'
import IEnvConfiguration from '../../../app/v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { OctopipeApiService } from '../../../app/v1/core/integrations/cd/octopipe/octopipe-api.service'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import * as uuid from 'uuid'
import { CdTypeEnum } from '../../../app/v1/api/configurations/enums'
import { CallbackTypeEnum } from '../../../app/v1/api/notifications/enums/callback-type.enum'

describe('CreateCircleDeploymentUsecase Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let deploymentsRepository: Repository<DeploymentEntity>
  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let componentsRepository: Repository<ComponentEntity>
  let moduleDeploymentRepository: Repository<ModuleDeploymentEntity>
  let envConfiguration: IEnvConfiguration
  let httpService: HttpService
  let octopipeApiService: OctopipeApiService

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
    deploymentsRepository = app.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
    componentsRepository = app.get<Repository<ComponentEntity>>('ComponentEntityRepository')
    moduleDeploymentRepository = app.get<Repository<ModuleDeploymentEntity>>('ModuleDeploymentEntityRepository')
    queuedDeploymentsRepository = app.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
    envConfiguration = app.get(IoCTokensConstants.ENV_CONFIGURATION)
    httpService = app.get<HttpService>(HttpService)
    octopipeApiService = app.get<OctopipeApiService>(OctopipeApiService)
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()

  })

  it('/POST deployments in circle should create deployment, module deployment and component deployment entities', async() => {
    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      id: uuid.v4(),
      workspaceId: uuid.v4(),
      type: CdTypeEnum.OCTOPIPE,
      configurationData: '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      name: 'config-name',
      authorId: 'author'
    })

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
      cdConfigurationId: cdConfiguration.id,
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      circle: {
        headerValue: 'circle-header'
      }
    }

    await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).set('x-circle-id', '12345')

    const deployment = await deploymentsRepository.findOne(
      { id: createDeploymentRequest.deploymentId },
      { relations: ['modules', 'modules.components'] }
    )

    if (!deployment) {
      fail('Deployment entity was not saved')
    }

    expect(deployment).toMatchObject({
      applicationName: createDeploymentRequest.applicationName,
      authorId: createDeploymentRequest.authorId,
      description: createDeploymentRequest.description,
      callbackUrl: createDeploymentRequest.callbackUrl,
      circle: createDeploymentRequest.circle,
      defaultCircle: false,
      status: DeploymentStatusEnum.CREATED,
      createdAt: expect.anything(),
      finishedAt: null,
      modules: [{
        moduleId: createDeploymentRequest.modules[0].moduleId,
        helmRepository: createDeploymentRequest.modules[0].helmRepository,
        status: DeploymentStatusEnum.CREATED,
        createdAt: expect.anything(),
        finishedAt: null,
        components: [
          {
            componentId: createDeploymentRequest.modules[0].components[0].componentId,
            componentName: createDeploymentRequest.modules[0].components[0].componentName,
            buildImageUrl: createDeploymentRequest.modules[0].components[0].buildImageUrl,
            buildImageTag: createDeploymentRequest.modules[0].components[0].buildImageTag,
            status: DeploymentStatusEnum.CREATED,
            createdAt: expect.anything(),
            finishedAt: null
          },
          {
            componentId: createDeploymentRequest.modules[0].components[1].componentId,
            componentName: createDeploymentRequest.modules[0].components[1].componentName,
            buildImageUrl: createDeploymentRequest.modules[0].components[1].buildImageUrl,
            buildImageTag: createDeploymentRequest.modules[0].components[1].buildImageTag,
            status: DeploymentStatusEnum.CREATED,
            createdAt: expect.anything(),
            finishedAt: null
          }
        ]
      }],
    })
  })

  it('/POST deployments/circle should do a upsert if a module already exists and has new components ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      id: uuid.v4(),
      workspaceId: uuid.v4(),
      type: CdTypeEnum.OCTOPIPE,
      configurationData: '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      name: 'config-name',
      authorId: 'author'
    })
    const module = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const createDeploymentRequest = {
      deploymentId: '5ba3691b-d647-4a36-9f6d-c089f114e476',
      applicationName: 'c26fbf77-5da1-4420-8dfa-4dea235a9b1e',
      modules: [
        {
          moduleId: module.id,
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: component.id,
              componentName: 'component-name',
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            },
            {
              componentId: 'component-id-upsert',
              componentName: 'component-upsert',
              buildImageUrl: 'image-url2',
              buildImageTag: 'image-tag2'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }

    await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).set('x-circle-id', '12345').expect(201)

    const componentsUpdated = await componentsRepository.find({
      where: { module: module.id },
      order: {
        createdAt: 'ASC'
      }
    })
    const deployment = await deploymentsRepository.findOne(
      { id: createDeploymentRequest.deploymentId },
      { relations: ['modules', 'modules.components'] }
    )
    if (!deployment) {

      fail('Deployment entity was not saved')
    }
    expect(componentsUpdated.length).toBe(2)
    expect(componentsUpdated[0].id).toEqual(createDeploymentRequest.modules[0].components[0].componentId)
    expect(componentsUpdated[1].id).toEqual(createDeploymentRequest.modules[0].components[1].componentId)
    expect(deployment.modules[0].components[0].componentId).toEqual(createDeploymentRequest.modules[0].components[0].componentId)
    expect(deployment.modules[0].components[1].componentId).toEqual(createDeploymentRequest.modules[0].components[1].componentId)
  })

  it('/POST /deployments in circle should fail when deployment already exists', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const deploymentDB = await fixtureUtilsService.createDeployment({
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfiguration.id,
      'circle': {
        'headerValue': 'headerValue'
      }
    })

    const createDeploymentRequest = {
      deploymentId: deploymentDB.id,
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
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }

    return request(app.getHttpServer())
      .post('/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', '12345')
      .expect(409)
  })

  it('/POST deployments in circle should enqueue RUNNING component deployments correctly', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

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
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }

    const { body: responseData } =
      await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).set('x-circle-id', '12345')
    const componentDeployments = responseData.modulesDeployments[0].componentsDeployments

    const queuedDeployment1 = await queuedDeploymentsRepository.findOne({ componentDeploymentId: componentDeployments[0].id })
    const queuedDeployment2 = await queuedDeploymentsRepository.findOne({ componentDeploymentId: componentDeployments[1].id })

    if (!queuedDeployment1 || !queuedDeployment2) {
      fail('QueuedDeployment entity(ies) was/were not saved')
    }

    expect(queuedDeployment1).toMatchObject({
      componentId: componentDeployments[0].componentId,
      componentDeploymentId: componentDeployments[0].id,
      status: QueuedPipelineStatusEnum.RUNNING,
      type: QueuedPipelineTypesEnum.QueuedDeploymentEntity,
      createdAt: expect.anything()
    })

    expect(queuedDeployment2).toMatchObject({
      componentId: componentDeployments[1].componentId,
      componentDeploymentId: componentDeployments[1].id,
      status: QueuedPipelineStatusEnum.RUNNING,
      type: QueuedPipelineTypesEnum.QueuedDeploymentEntity,
      createdAt: expect.anything()
    })
  })

  it('/POST /deployments in circle should enqueue QUEUED and RUNNING component deployments correctly', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })
    const module = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })
    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': 'module-deployment-id',
      'componentId': component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

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
        },
        {
          moduleId: componentDeployment.moduleDeployment,
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: component.id,
              componentName: componentDeployment.componentName,
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }

    const { body: responseData } =
      await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).set('x-circle-id', '12345')
    const componentDeployments1 = responseData.modulesDeployments[0].componentsDeployments
    const componentDeployments2 = responseData.modulesDeployments[1].componentsDeployments

    const queuedDeployment1 = await queuedDeploymentsRepository.findOne({ componentDeploymentId: componentDeployments1[0].id })
    const queuedDeployment2 = await queuedDeploymentsRepository.findOne({ componentDeploymentId: componentDeployments1[1].id })
    const queuedDeployment3 = await queuedDeploymentsRepository.findOne({ componentDeploymentId: componentDeployments2[0].id })

    if (!queuedDeployment1 || !queuedDeployment2 || !queuedDeployment3) {
      fail('QueuedDeployment entity(ies) was/were not saved')
    }

    expect(queuedDeployment1).toMatchObject({
      componentId: componentDeployments1[0].componentId,
      componentDeploymentId: componentDeployments1[0].id,
      status: QueuedPipelineStatusEnum.RUNNING,
      type: QueuedPipelineTypesEnum.QueuedDeploymentEntity,
      createdAt: expect.anything()
    })

    expect(queuedDeployment2).toMatchObject({
      componentId: componentDeployments1[1].componentId,
      componentDeploymentId: componentDeployments1[1].id,
      status: QueuedPipelineStatusEnum.RUNNING,
      type: QueuedPipelineTypesEnum.QueuedDeploymentEntity,
      createdAt: expect.anything()
    })

    expect(queuedDeployment3).toMatchObject({
      componentId: componentDeployments2[0].componentId,
      componentDeploymentId: componentDeployments2[0].id,
      status: QueuedPipelineStatusEnum.QUEUED,
      type: QueuedPipelineTypesEnum.QueuedDeploymentEntity,
      createdAt: expect.anything()
    })
  })

  it('/POST /deployments in circle should correctly update component pipeline options', async() => {
    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': 'module-id'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': 'module-deployment-id',
      'componentId': component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

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
        },
        {
          moduleId: componentDeployment.moduleDeployment,
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: component.id,
              componentName: componentDeployment.componentName,
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }

    const { body: responseData } =
      await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).set('x-circle-id', '12345')
    const componentDeployments1 = responseData.modulesDeployments[0].componentsDeployments
    const componentDeployments2 = responseData.modulesDeployments[1].componentsDeployments

    const component1 = await componentsRepository.findOne({ id: componentDeployments1[0].componentId })
    const component2 = await componentsRepository.findOne({ id: componentDeployments1[1].componentId })
    const component3 = await componentsRepository.findOne({ id: componentDeployments2[0].componentId })

    if (!component1 || !component2 || !component3) {
      fail('Component entity(ies) was/were not saved')
    }

    expect(component1.pipelineOptions).toEqual(
      {
        pipelineCircles: [{ header: { headerName: 'x-circle-id', headerValue: 'circle-header' }, destination: { version: 'image-tag' } }],
        pipelineVersions: [{ version: 'image-tag', versionUrl: 'image-url' }],
        pipelineUnusedVersions: []
      }
    )

    expect(component2.pipelineOptions).toEqual(
      {
        pipelineCircles: [{ header: { headerName: 'x-circle-id', headerValue: 'circle-header' }, destination: { version: 'image-tag2' } }],
        pipelineVersions: [{ version: 'image-tag2', versionUrl: 'image-url2' }],
        pipelineUnusedVersions: []
      }
    )

    expect(component3.pipelineOptions).toEqual(
      { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
    )
  })

  it('/POST /deployments in circle  should call octopipe for each RUNNING component deployment', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': 'module-id'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': 'module-deployment-id',
      'componentId': component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

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
        },
        {
          moduleId: componentDeployment.moduleDeployment,
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: component.id,
              componentName: componentDeployment.componentName,
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }

    const httpSpy = jest.spyOn(httpService, 'post')

    await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).set('x-circle-id', '12345')

    expect(httpSpy).toHaveBeenCalledTimes(2)

    const expectedOctopipePayload1 = {
      appName: 'component-name',
      appNamespace: 'qa',
      git: {
        provider: 'GITHUB',
        token: 'my-token'
      },
      helmUrl: 'helm-repository.com',
      istio: {
        virtualService: {},
        destinationRules: {}
      },
      unusedVersions: [{}],
      versions: [
        {
          versionUrl: 'image-url',
          version: 'component-name-image-tag'
        }
      ],
      callbackType: CallbackTypeEnum.DEPLOYMENT,
      webHookUrl: expect.stringContaining(envConfiguration.darwinDeploymentCallbackUrl),
      circleId: '12345'
    }

    expect(httpSpy).toHaveBeenCalledWith(
      `${envConfiguration.octopipeUrl}/api/v1/pipelines`,
      expectedOctopipePayload1,
      expect.anything()
    )

    const expectedOctopipePayload2 = {
      appName: 'component-name2',
      appNamespace: 'qa',
      git: {
        provider: 'GITHUB',
        token: 'my-token'
      },
      helmUrl: 'helm-repository.com',
      istio: {
        virtualService: {},
        destinationRules: {}
      },
      unusedVersions: [{}],
      versions: [
        {
          versionUrl: 'image-url2',
          version: 'component-name2-image-tag2'
        }
      ],
      callbackType: CallbackTypeEnum.DEPLOYMENT,
      webHookUrl: expect.stringContaining(envConfiguration.darwinDeploymentCallbackUrl),
      circleId: '12345'
    }

    expect(httpSpy).toHaveBeenCalledWith(
      `${envConfiguration.octopipeUrl}/api/v1/pipelines`,
      expectedOctopipePayload2,
      expect.anything()
    )
  })

  it('/POST /deployments in circle should not set failed the  module of queued component', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': 'module-id'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': 'module-deployment-id',
      'componentId': component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })
    fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    jest.spyOn(octopipeApiService, 'deploy').mockImplementation(() => {
      throw new Error()
    })

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
        },
        {
          moduleId: componentDeployment.moduleDeployment,
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: component.id,
              componentName: componentDeployment.componentName,
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: cdConfiguration.id,
      circleId: '12345',
      circle: {
        headerValue: 'header-value'
      }
    }

    await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).expect(500).set('x-circle-id', '123456')

    const deployment: DeploymentEntity = await deploymentsRepository.findOneOrFail(
      { where: { id: createDeploymentRequest.deploymentId }, relations: ['modules'] }
    )

    const modulesDeployment: ModuleDeploymentEntity[] = await moduleDeploymentRepository.find(
      { where: { deploymentId: deployment.id }, relations: ['components'], order: { status: 'ASC' } }
    )

    expect(deployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(modulesDeployment[0].status).toBe(DeploymentStatusEnum.CREATED)
    expect(modulesDeployment[0].components[0].status).toBe(DeploymentStatusEnum.CREATED)
    expect(modulesDeployment[1].components[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(modulesDeployment[1].components[1].status).toBe(DeploymentStatusEnum.FAILED)
  })

  it('/POST should handle deployment failure ', async() => {
    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    jest.spyOn(octopipeApiService, 'deploy').mockImplementation(() => {
      throw new Error()
    })
    jest.spyOn(httpService, 'post').mockImplementation(() => of({} as AxiosResponse))
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
      cdConfigurationId: cdConfiguration.id,
      circleId: '12345',
      circle: {
        headerValue: 'header-value'
      }
    }

    await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest).expect(500)

    const deployment: DeploymentEntity = await deploymentsRepository.findOneOrFail(
      { where: { id: createDeploymentRequest.deploymentId }, relations: ['modules', 'modules.components'] }
    )

    expect(deployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].components[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].components[1].status).toBe(DeploymentStatusEnum.FAILED)
  })

  it('/POST deployments/circle with repeated components should return unprocessable entity status', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

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
      cdConfigurationId: cdConfiguration.id,
      circle: {
        headerValue: 'circle-header'
      }
    }
    const response = await request(app.getHttpServer()).post('/deployments').send(createDeploymentRequest)
      .set('x-circle-id', '12345')
    const responseObject = JSON.parse(response.text)
    expect(responseObject.statusCode).toEqual(422)
    expect(responseObject.message).toEqual('Deployment should not have repeated components')

  })

  afterAll(async() => {
    await app.close()
  })
})
