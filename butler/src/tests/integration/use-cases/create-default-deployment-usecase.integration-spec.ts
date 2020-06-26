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
import { DeploymentEntity } from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../app/api/deployments/enums'
import { QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import { ComponentEntity } from '../../../app/api/components/entity'
import IEnvConfiguration from '../../../app/core/integrations/configuration/interfaces/env-configuration.interface'
import { IoCTokensConstants } from '../../../app/core/constants/ioc'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios';
import { OctopipeApiService } from '../../../app/core/integrations/cd/octopipe/octopipe-api.service';
import {CallbackTypeEnum} from '../../../app/api/notifications/enums/callback-type.enum';

describe('CreateDefaultDeploymentUsecase', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let deploymentsRepository: Repository<DeploymentEntity>
  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let componentsRepository: Repository<ComponentEntity>
  let envConfiguration: IEnvConfiguration
  let httpService: HttpService
  let octopipeApiService: OctopipeApiService

  beforeAll(async () => {
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
    queuedDeploymentsRepository = app.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
    componentsRepository = app.get<Repository<ComponentEntity>>('ComponentEntityRepository')
    envConfiguration = app.get(IoCTokensConstants.ENV_CONFIGURATION)
    httpService = app.get<HttpService>(HttpService)
    octopipeApiService = app.get<OctopipeApiService>(OctopipeApiService)
    await fixtureUtilsService.clearDatabase()
    await fixtureUtilsService.loadDatabase()
  })

  beforeEach(async () => {
    await fixtureUtilsService.clearDatabase()
    await fixtureUtilsService.loadDatabase()
  })

  it(`/POST deployments/default should create deployment, module deployment and component deployment entities`, async () => {

    const createDeploymentRequest = {
      deploymentId: 'e4c41beb-0a77-44c4-8d77-9addf3fc8ea9',
      applicationName: 'dae2121f-8b06-4218-9de4-97dc0becccab',
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
      circle: null
    }

    await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest).expect(201)

    const deployment = await deploymentsRepository.findOne(
      { id: createDeploymentRequest.deploymentId },
      { relations: ['modules', 'modules.components'] }
    )

    if (!deployment) {
      fail('Deployment entity was not saved')
    }

    expect(deployment.applicationName).toEqual(createDeploymentRequest.applicationName)
    expect(deployment.authorId).toEqual(createDeploymentRequest.authorId)
    expect(deployment.description).toEqual(createDeploymentRequest.description)
    expect(deployment.callbackUrl).toEqual(createDeploymentRequest.callbackUrl)
    expect(deployment.circle).toBeNull()
    expect(deployment.defaultCircle).toEqual(true)
    expect(deployment.status).toEqual(DeploymentStatusEnum.CREATED)
    expect(deployment.circleId).toBeNull()
    expect(deployment.finishedAt).toBeNull()
    expect(deployment.createdAt).toBeDefined()

    const expectedModules = [{
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
    }]

    expect(deployment.modules).toMatchObject(expectedModules)
  })

  it(`/POST deployments/default should fail if already exists deployment `, done => {
    const createDeploymentRequest = {
      deploymentId: '2adc7ac1-61ff-4630-8ba9-eba33c00ad24',
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
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      callbackUrl: 'http://localhost:8883/moove',
    }

    return request(app.getHttpServer())
      .post('/deployments/default')
      .send(createDeploymentRequest)
      .expect(400, done)

  })

  it(`/POST deployments/default  should enqueue RUNNING component deployments correctly`, async () => {

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

      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      callbackUrl: 'http://localhost:8883/moove',
    }

    const { body: responseData } =
      await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest)
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

  it(`/POST deployments/default should enqueue QUEUED and RUNNING component deployments correctly`, async () => {
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
          moduleId: '23776617-7840-4819-b356-30e165b7ebb9',
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: '68335d19-ce03-4cf8-84b4-5574257c982e',
              componentName: 'component-name',
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      callbackUrl: 'http://localhost:8883/moove',
    }

    const { body: responseData } =
      await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest)

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

  it(`/POST deployments/default should correctly update component pipeline options`, async () => {

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
          moduleId: '23776617-7840-4819-b356-30e165b7ebb9',
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: '68335d19-ce03-4cf8-84b4-5574257c982e',
              componentName: 'component-name',
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      typeCallback: CallbackTypeEnum.DEPLOYMENT,
      circle: {
        headerValue: 'circle-header'
      }
    }

    const { body: responseData } =
      await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest)
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
        pipelineCircles: [{ destination: { version: 'image-tag' } }],
        pipelineVersions: [{ version: 'image-tag', versionUrl: 'image-url' }],
        pipelineUnusedVersions: []
      }
    )

    expect(component2.pipelineOptions).toEqual(
      {
        pipelineCircles: [{ destination: { version: 'image-tag2' } }],
        pipelineVersions: [{ version: 'image-tag2', versionUrl: 'image-url2' }],
        pipelineUnusedVersions: []
      }
    )

    expect(component3.pipelineOptions).toEqual(
      { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
    )
  })

  it(`/POST deployments/default should call octopipe for each RUNNING component deployment`, async () => {
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
          moduleId: '23776617-7840-4819-b356-30e165b7ebb9',
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: '68335d19-ce03-4cf8-84b4-5574257c982e',
              componentName: 'component-name',
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      callbackUrl: 'http://localhost:8883/moove',
    }
    const httpSpy = jest.spyOn(httpService, 'post')
    await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest)

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
      unusedVersions: [],
      versions: [
        {
          versionUrl: 'image-url',
          version: 'component-name-image-tag'
        }
      ],
      typeCallback: CallbackTypeEnum.DEPLOYMENT,
      webHookUrl: expect.stringContaining(envConfiguration.darwinDeploymentCallbackUrl),
      circleId: null
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
      unusedVersions: [],
      versions: [
        {
          versionUrl: 'image-url2',
          version: 'component-name2-image-tag2'
        }
      ],
      typeCallback: CallbackTypeEnum.DEPLOYMENT,
      webHookUrl: expect.stringContaining(envConfiguration.darwinDeploymentCallbackUrl),
      circleId: null
    }

    expect(httpSpy).toHaveBeenCalledWith(
      `${envConfiguration.octopipeUrl}/api/v1/pipelines`,
      expectedOctopipePayload2,
      expect.anything()
    )
  })

  it(`/POST deployments/default should handle deployment failure `, async () => {
    jest.spyOn(octopipeApiService, 'deploy').
    mockImplementation( () => { throw new Error() })
    jest.spyOn(httpService, 'post').
    mockImplementation( () =>  of({} as AxiosResponse) )
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
      circleId : null,
      circle : null
    }

    await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest).expect(500)
    const deployment: DeploymentEntity = await deploymentsRepository.findOneOrFail({ where: { id: createDeploymentRequest.deploymentId }, relations: ['modules', 'modules.components'] })
    expect(deployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].components[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].components[1].status).toBe(DeploymentStatusEnum.FAILED)
  })

  it(`/POST deployments/default should handle deployment failure `, async () => {
    jest.spyOn(octopipeApiService, 'deploy').
    mockImplementation( () => { throw new Error() })
    jest.spyOn(httpService, 'post').
    mockImplementation( () =>  of({} as AxiosResponse) )
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
          moduleId: '23776617-7840-4819-b356-30e165b7ebb9',
          helmRepository: 'helm-repository.com',
          components: [
            {
              componentId: '68335d19-ce03-4cf8-84b4-5574257c982e',
              componentName: 'component-name',
              buildImageUrl: 'image-url',
              buildImageTag: 'image-tag'
            }
          ]
        }
      ],
      authorId: 'author-id',
      description: 'Deployment from Charles C.D.',
      callbackUrl: 'http://localhost:8883/moove',
      cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
      circleId : null,
      circle : null
    }

    await request(app.getHttpServer()).post('/deployments/default').send(createDeploymentRequest).expect(500)
    const deployment: DeploymentEntity = await deploymentsRepository.findOneOrFail({ where: { id: createDeploymentRequest.deploymentId }, relations: ['modules', 'modules.components'] })
    expect(deployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[0].status).toBe(DeploymentStatusEnum.CREATED)
    expect(deployment.modules[0].components[0].status).toBe(DeploymentStatusEnum.CREATED)
    expect(deployment.modules[1].components[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(deployment.modules[1].components[1].status).toBe(DeploymentStatusEnum.FAILED)
  })

  afterAll(async () => {
    await app.close()
  })
})
