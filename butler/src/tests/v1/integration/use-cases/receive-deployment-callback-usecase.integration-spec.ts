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
import { AppModule } from '../../../../app/app.module'
import * as request from 'supertest'
import { TestSetupUtils } from '../utils/test-setup-utils'
import { ComponentDeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from '../../../../app/v1/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../../app/v1/api/deployments/enums'
import { ComponentDeploymentsRepository, QueuedIstioDeploymentsRepository } from '../../../../app/v1/api/deployments/repository'
import { ComponentEntity } from '../../../../app/v1/api/components/entity'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { MooveService } from '../../../../app/v1/core/integrations/moove'
import { ModuleDeploymentsRepository } from '../../../../app/v1/api/deployments/repository/module-deployments.repository'
import { CallbackTypeEnum } from '../../../../app/v1/api/notifications/enums/callback-type.enum'
import * as uuid from 'uuid'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'

describe('DeploymentCallbackUsecase Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let queuedDeploymentsRepository: Repository<QueuedDeploymentEntity>
  let queuedIstioDeploymentsRepository: QueuedIstioDeploymentsRepository
  let componentsRepository: Repository<ComponentEntity>
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let moduleDeploymentsRepository: ModuleDeploymentsRepository
  let httpService: HttpService
  let mooveService: MooveService

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
    componentsRepository = app.get<Repository<ComponentEntity>>('ComponentEntityRepository')
    componentDeploymentsRepository = app.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
    moduleDeploymentsRepository = app.get<ModuleDeploymentsRepository>(ModuleDeploymentsRepository)
    queuedDeploymentsRepository = app.get<Repository<QueuedDeploymentEntity>>('QueuedDeploymentEntityRepository')
    queuedIstioDeploymentsRepository = app.get<QueuedIstioDeploymentsRepository>(QueuedIstioDeploymentsRepository)
    httpService = app.get<HttpService>(HttpService)
    mooveService = app.get<MooveService>(MooveService)
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('/POST a default circle deploy  callback fails should update status and notify moove ', async() => {
    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    const finishDeploymentDto = {
      status : 'FAILED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: queuedDeployment.componentDeploymentId,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.FAILED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(spy).toBeCalled()
  })

  it('/POST a default deploy callback success should update status and notify moove ', async() => {
    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    const finishDeploymentDto = {
      status : 'SUCCEEDED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: queuedDeployment.componentDeploymentId,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.SUCCEEDED)
  })

  it('/POST a circle deploy callback fail should update status and notify moove ', async() => {
    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    const finishDeploymentDto = {
      status: 'FAILED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: queuedDeployment.componentDeploymentId,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.FAILED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(spy).toBeCalled()
  })

  it('/POST deploy/callback in circle  should remove pipeline options when deployment failure', async() => {

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component.id,
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    const finishDeploymentDto = {
      status: 'FAILED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: queuedDeployment.componentDeploymentId,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment'] }
      )

    const componentEntity: ComponentEntity = await componentsRepository.
      findOneOrFail({
        where : { id: componentDeploymentEntity.componentId } }
      )

    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.FAILED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(spy).toBeCalled()
    expect(componentEntity.pipelineOptions).toEqual(
      {
        pipelineCircles: [],
        pipelineVersions: [],
        pipelineUnusedVersions: []
      }
    )
  })

  it('/POST when have success in all callbacks, deployment status should not Be SUCCEEDED yet ', async() => {

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

    const module2 = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const component2 = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module2.id,
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })
    const moduleDeployment2 = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'RUNNING',
      'helmRepository': 'helm-repository'
    })

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'SUCCEEDED'
    })

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment2.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createQueuedIstioDeployment({
      'deploymentId': 'deployment-id',
      'componentId': 'component-id',
      'componentDeploymentId': componentDeploymentEntity1.id,
      'status': 'QUEUED',
      'type': 'QueuedIstioDeploymentEntity'
    })

    await fixtureUtilsService.createQueuedIstioDeployment({
      'deploymentId': 'deployment-id',
      'componentId': 'component-id',
      'componentDeploymentId': componentDeploymentEntity2.id,
      'status': 'QUEUED',
      'type': 'QueuedIstioDeploymentEntity'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component2.id,
      'componentDeploymentId': componentDeploymentEntity2.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    const finishDeploymentDto = {
      status : 'SUCCEEDED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: componentDeploymentEntity2.id,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment', 'moduleDeployment.deployment'] }
      )

    const moduleDeploymentEntities: ModuleDeploymentEntity[] = await moduleDeploymentsRepository.
      find({
        where : {
          deployment: componentDeploymentEntity.moduleDeployment.deployment.id
        },
        relations: ['components'] }
      )

    const deploymentDB = componentDeploymentEntity.moduleDeployment.deployment
    expect(deploymentDB.status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  it('/POST when all callbacks have success, each istio queued deployment should be RUNNING ', async() => {

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

    const module2 = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const component2 = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module2.id,
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id',
      'status': 'SUCCEEDED',
      'helmRepository': 'helm-repository'
    })
    const moduleDeployment2 = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id2',
      'status': 'CREATED',
      'helmRepository': 'helm-repository'
    })

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'SUCCEEDED'
    })

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment2.id,
      'componentId':  component2.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createQueuedIstioDeployment({
      'deploymentId': deployment.id,
      'componentId': component.id,
      'componentDeploymentId': componentDeploymentEntity1.id,
      'status': 'QUEUED',
      'type': 'QueuedIstioDeploymentEntity'
    })

    await fixtureUtilsService.createQueuedIstioDeployment({
      'deploymentId': deployment.id,
      'componentId': component2.id,
      'componentDeploymentId': componentDeploymentEntity2.id,
      'status': 'QUEUED',
      'type': 'QueuedIstioDeploymentEntity'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component2.id,
      'componentDeploymentId': componentDeploymentEntity2.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: componentDeploymentEntity2.id,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      }
      )

    const moduleDeploymentEntities: ModuleDeploymentEntity[] = await moduleDeploymentsRepository.
      find({
        where : {
          deployment: componentDeploymentEntity.moduleDeployment.deployment.id
        },
        relations: ['components'] }
      )

    const deploymentDB = componentDeploymentEntity.moduleDeployment.deployment
    const istioQueuedDeployments = await queuedIstioDeploymentsRepository.find(
      { where : { deploymentId : deployment.id }
      })
    expect(deploymentDB.status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(istioQueuedDeployments[0].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(istioQueuedDeployments[1].status).toBe(QueuedPipelineStatusEnum.RUNNING)

    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  it('/POST when one callback fails, each istio queued deployment should be QUEUED ', async() => {

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

    const module2 = await fixtureUtilsService.createModule({
      'id': uuid.v4()
    })

    const component = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module.id
    })

    const component2 = await fixtureUtilsService.createComponent({
      'id': uuid.v4(),
      'module': module2.id
    })

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id',
      'status': 'CREATED',
      'helmRepository': 'helm-repository'
    })
    const moduleDeployment2 = await fixtureUtilsService.createModuleDeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'moduleId': 'module-id',
      'status': 'CREATED',
      'helmRepository': 'helm-repository'
    })

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'SUCCEEDED'
    })

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': moduleDeployment2.id,
      'componentId':  component.id,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    await fixtureUtilsService.createQueuedIstioDeployment({
      'deploymentId': deployment.id,
      'componentId': component.id,
      'componentDeploymentId': componentDeploymentEntity1.id,
      'status': 'QUEUED',
      'type': 'QueuedIstioDeploymentEntity'
    })

    await fixtureUtilsService.createQueuedIstioDeployment({
      'deploymentId': deployment.id,
      'componentId': component.id,
      'componentDeploymentId': componentDeploymentEntity2.id,
      'status': 'QUEUED',
      'type': 'QueuedIstioDeploymentEntity'
    })

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment({
      'componentId': component2.id,
      'componentDeploymentId': componentDeploymentEntity2.id,
      'status': 'RUNNING',
      'type': 'QueuedDeploymentEntity'
    })

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED',
      callbackType: CallbackTypeEnum.DEPLOYMENT
    }

    await request(app.getHttpServer()).post(`/notifications?queueId=${queuedDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeployment = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: componentDeploymentEntity2.id,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeployment.componentDeploymentId
        },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      }
      )

    const moduleDeploymentEntities: ModuleDeploymentEntity[] = await moduleDeploymentsRepository.
      find({
        where : {
          deployment: componentDeploymentEntity.moduleDeployment.deployment.id
        },
        relations: ['components'],
        order: { status: 'ASC' }
      })

    const deploymentDB = componentDeploymentEntity.moduleDeployment.deployment
    const istioQueuedDeployments = await queuedIstioDeploymentsRepository.find(
      { where : {
        deploymentId : componentDeploymentEntity.moduleDeployment.deployment.id
      }
      })
    expect(deploymentDB.status).toBe(DeploymentStatusEnum.FAILED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(istioQueuedDeployments[0].status).toBe(QueuedPipelineStatusEnum.QUEUED)
    expect(istioQueuedDeployments[1].status).toBe(QueuedPipelineStatusEnum.QUEUED)
    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  afterAll(async() => {
    await app.close()
  })
})
