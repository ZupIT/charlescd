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
import { AxiosResponse } from 'axios'
import { Test } from '@nestjs/testing'
import { HttpService, INestApplication } from '@nestjs/common'
import { FixtureUtilsService } from '../utils/fixture-utils.service'
import { AppModule } from '../../../app/app.module'
import * as request from 'supertest'
import { TestSetupUtils } from '../utils/test-setup-utils'
import { DeploymentEntity, ModuleUndeploymentEntity, UndeploymentEntity } from '../../../app/v1/api/deployments/entity'
import { Repository } from 'typeorm'
import { QueuedDeploymentsRepository } from '../../../app/v1/api/deployments/repository'
import { IoCTokensConstants } from '../../../app/v1/core/constants/ioc'
import IEnvConfiguration from '../../../app/v1/core/integrations/configuration/interfaces/env-configuration.interface'
import {
  QueuedPipelineStatusEnum,
  UndeploymentStatusEnum
} from '../../../app/v1/api/deployments/enums'
import { OctopipeApiService } from '../../../app/v1/core/integrations/cd/octopipe/octopipe-api.service'
import {  of } from 'rxjs'
import { PipelineErrorHandlerService } from '../../../app/v1/api/deployments/services'
import { ModuleUndeploymentsRepository } from '../../../app/v1/api/deployments/repository/module-undeployments.repository'
import { UndeploymentsRepository } from '../../../app/v1/api/deployments/repository/undeployments.repository'
import { CallbackTypeEnum } from '../../../app/v1/api/notifications/enums/callback-type.enum'
import * as uuid from 'uuid'
import { CdTypeEnum } from '../../../app/v1/api/configurations/enums'

describe('CreateUnDeploymentUsecase Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let undeploymentsRepository: UndeploymentsRepository
  let deploymentsRepository: Repository<DeploymentEntity>
  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let moduleUndeploymentsRepository: ModuleUndeploymentsRepository
  let envConfiguration: IEnvConfiguration
  let httpService: HttpService
  let octopipeApiService: OctopipeApiService
  let pipelineErrorHandlerService: PipelineErrorHandlerService

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
    undeploymentsRepository = app.get<UndeploymentsRepository>(UndeploymentsRepository)
    deploymentsRepository = app.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
    moduleUndeploymentsRepository = app.get<ModuleUndeploymentsRepository>(ModuleUndeploymentsRepository)
    queuedDeploymentsRepository = app.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
    envConfiguration = app.get(IoCTokensConstants.ENV_CONFIGURATION)
    httpService = app.get<HttpService>(HttpService)
    octopipeApiService = app.get<OctopipeApiService>(OctopipeApiService)
    pipelineErrorHandlerService = app.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('/POST undeploy should call octopipe for each RUNNING component undeployment', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration( {
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const deployment = await fixtureUtilsService.createDeployment({
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfiguration.id,
      'circle' : {
        'headerValue' : 'headerValue'
      }
    })

    const module = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const component2 = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'componentName',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment,
      'componentId':  component2.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'componentName2',
      'status': 'CREATED'
    })

    const createUndeploymentRequest = {
      authorId : 'author-id',
      deploymentId : deployment.id
    }

    jest.spyOn(octopipeApiService, 'deploy').
      mockImplementation( () => of({} as AxiosResponse))
    const octopipeServiceSpy = jest.spyOn(octopipeApiService, 'deploy')

    await request(app.getHttpServer()).post('/undeployments').send(createUndeploymentRequest).expect(201)
    expect(octopipeServiceSpy).toHaveBeenCalledTimes(2)

    const expectedOctopipePayload1 = {
      appName: 'componentName2',
      appNamespace: 'qa',
      circleId: undefined,
      git: {
        provider: 'GITHUB',
        token: 'my-token'
      },
      helmUrl: 'helm-repository',
      istio: {
        virtualService: {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: 'componentName2',
            namespace: 'qa'
          },
          spec: {
            hosts: [
              'unreachable-app-name'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      'unreachable-cookie-name': {
                        exact: 'unreachable-cookie - value'
                      }
                    }
                  },
                ],
                route: [
                  {
                    destination: {
                      host: 'unreachable-app-name',
                    },
                  }
                ]
              }
            ]
          }
        },
        destinationRules: {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'DestinationRule',
          metadata: {
            name: 'componentName2',
            namespace: 'qa'
          },
          spec: {
            host: 'componentName2',
            subsets: []
          }
        }
      },
      unusedVersions: [],
      versions: [],
      webHookUrl: expect.stringContaining(envConfiguration.darwinUndeploymentCallbackUrl),
      callbackType: CallbackTypeEnum.UNDEPLOYMENT
    }

    expect(octopipeServiceSpy).toHaveBeenCalledWith(
      expectedOctopipePayload1
    )

    const expectedOctopipePayload2 = {
      appName: 'componentName',
      appNamespace: 'qa',
      circleId: undefined,
      git: {
        provider: 'GITHUB',
        token: 'my-token'
      },
      helmUrl: 'helm-repository',
      istio: {
        virtualService: {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: 'componentName',
            namespace: 'qa'
          },
          spec: {
            hosts: [
              'unreachable-app-name'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      'unreachable-cookie-name': {
                        exact: 'unreachable-cookie - value'
                      }
                    }
                  },
                ],
                route: [
                  {
                    destination: {
                      host: 'unreachable-app-name',
                    },
                  }
                ]
              }
            ]
          }
        },
        destinationRules: {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'DestinationRule',
          metadata: {
            name: 'componentName',
            namespace: 'qa'
          },
          spec: {
            host: 'componentName',
            subsets: []
          }
        }
      },
      unusedVersions: [],
      versions: [],
      webHookUrl: expect.stringContaining(envConfiguration.darwinUndeploymentCallbackUrl),
      callbackType: CallbackTypeEnum.UNDEPLOYMENT
    }

    expect(octopipeServiceSpy).toHaveBeenCalledWith(
      expectedOctopipePayload2
    )

  })

  it('/POST /undeploy should create undeployment, componentundeployment and moduleundeployment of a circle deployment', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration( {
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const deployment = await fixtureUtilsService.createDeployment({
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfiguration.id,
      'circle' : {
        'headerValue' : 'headerValue'
      }
    })

    const module = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    const createUndeploymentRequest = {
      authorId : 'author-id',
      deploymentId: deployment.id
    }

    const { body: responseData } = await request(app.getHttpServer()).post('/undeployments').send(createUndeploymentRequest).expect(201)
    const undeployment = responseData
    const deploymentDB = await deploymentsRepository.findOne(
      { id: createUndeploymentRequest.deploymentId },
      { relations: ['modules', 'modules.components'] }
    )

    if (!undeployment) {
      fail('Undeployment was not saved')
    }
    if (!deploymentDB) {
      fail('Undeployment has no deployment')
    }
    expect(undeployment).toMatchObject({
      authorId: createUndeploymentRequest.authorId,
      modulesUndeployments: [{
        moduleUndeployment: deploymentDB.modules[0].id,
        componentsUndeployments: [
          {
            componentDeployment: deploymentDB.modules[0].components[0].id,
            status: UndeploymentStatusEnum.CREATED
          }
        ]
      }],
      deployment: deployment.id
    })

  })

  it('/POST /undeploy should fail when creating undeploy on  default circle ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration( {
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const deployment = await fixtureUtilsService.createDeployment({
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfiguration.id,
      'circle' : null
    })

    const createUndeploymentRequest = {
      authorId : 'author-id',
      deploymentId: deployment.id
    }

    await request(app.getHttpServer()).post('/undeployments').send(createUndeploymentRequest).expect(400)
  })

  it('/POST /undeploy should enqueue QUEUED and RUNNING component undeployments correctly', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration( {
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const deployment = await fixtureUtilsService.createDeployment({
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfiguration.id,
      'circle' : {
        'headerValue' : 'headerValue'
      }
    })

    const module = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const component2 = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component2.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    jest.spyOn(octopipeApiService, 'deploy')
      .mockImplementation( () => of({} as AxiosResponse))
    const createUndeploymentRequest = {
      authorId : 'author-id',
      deploymentId : deployment.id
    }

    const { body: responseData } = await request(app.getHttpServer()).post('/undeployments').send(createUndeploymentRequest).expect(201)
    const undeployment = responseData
    const queuedUnDeployment1 = await queuedDeploymentsRepository.findOne( {
      where: {
        componentUndeploymentId: undeployment.modulesUndeployments[0].componentsUndeployments[0].id
      }
    })
    const queuedUnDeployment2 = await queuedDeploymentsRepository.findOne({
      where: {
        componentUndeploymentId: undeployment.modulesUndeployments[0].componentsUndeployments[1].id
      }
    })
    const queuedUnDeployment3 = await queuedDeploymentsRepository.findOne({
      where: {
        componentUndeploymentId: undeployment.modulesUndeployments[0].componentsUndeployments[2].id
      }
    })

    if (!queuedUnDeployment1 || !queuedUnDeployment2 || !queuedUnDeployment3) {
      fail('Queued Undeployment not saved')
    }
    expect(queuedUnDeployment1.status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(queuedUnDeployment2.status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(queuedUnDeployment3.status).toBe(QueuedPipelineStatusEnum.QUEUED)
  })

  it('/POST /undeploy should handle  undeployment  failure and set only failed the module that failed', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfiguration( {
      'id': uuid.v4(),
      'workspaceId': uuid.v4(),
      'type': CdTypeEnum.OCTOPIPE,
      'configurationData': '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      'name': 'config-name',
      'authorId': 'author'
    })

    const deployment = await fixtureUtilsService.createDeployment({
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfiguration.id,
      'circle' : {
        'headerValue' : 'headerValue'
      }
    })

    const module = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const componentFails = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const componentFails2 = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  componentFails.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  componentFails2.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    jest.spyOn(octopipeApiService, 'deploy').
      mockImplementation( () => { throw new Error() })

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    const spyHandleUndeployment = jest.spyOn(pipelineErrorHandlerService, 'handleUndeploymentFailure')
    const spyHandleComponentUndeployment = jest.spyOn(pipelineErrorHandlerService, 'handleComponentUndeploymentFailure')

    const createUndeploymentRequest = {
      authorId : 'author-id',
      deploymentId: deployment.id
    }

    await request(app.getHttpServer()).post('/undeployments').send(createUndeploymentRequest).expect(500)

    const undeployment: UndeploymentEntity = await undeploymentsRepository.findOneOrFail({ where: { deployment: createUndeploymentRequest.deploymentId, status: UndeploymentStatusEnum.FAILED } })

    const moduleUndeployment: ModuleUndeploymentEntity[] = await moduleUndeploymentsRepository.find(
      { where :
          { undeployment: undeployment.id },
      relations: ['componentUndeployments'],
      order : { status: 'ASC' }
      })

    expect(spyHandleUndeployment).toHaveBeenCalledTimes(3)
    expect(spyHandleComponentUndeployment).toHaveBeenCalledTimes(2)
    expect(undeployment.status).toBe(UndeploymentStatusEnum.FAILED)
    expect(undeployment.finishedAt).not.toBeNull()
    expect(moduleUndeployment[0].status).toBe(UndeploymentStatusEnum.CREATED)
    expect(moduleUndeployment[1].status).toBe(UndeploymentStatusEnum.CREATED)
    expect(moduleUndeployment[2].status).toBe(UndeploymentStatusEnum.FAILED)
  })

  afterAll(async() => {
    await app.close()
  })
})
