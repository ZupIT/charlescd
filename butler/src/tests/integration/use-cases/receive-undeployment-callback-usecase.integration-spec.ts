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
import {
  ComponentUndeploymentEntity, ModuleUndeploymentEntity,
  QueuedUndeploymentEntity,
} from '../../../app/v1/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../app/v1/api/deployments/enums'
import {
  ComponentUndeploymentsRepository,
} from '../../../app/v1/api/deployments/repository'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { MooveService } from '../../../app/v1/core/integrations/moove'
import { ModuleUndeploymentsRepository } from '../../../app/v1/api/deployments/repository/module-undeployments.repository'
import * as uuid from 'uuid'
import { CdTypeEnum } from '../../../app/v1/api/configurations/enums'

describe('UndeploymentCallbackUsecase Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>
  let moduleUndeploymentsRepository: ModuleUndeploymentsRepository
  let componentUndeploymentsRepository: ComponentUndeploymentsRepository
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
    componentUndeploymentsRepository = app.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)
    queuedUndeploymentsRepository = app.get<Repository<QueuedUndeploymentEntity>>('QueuedUndeploymentEntityRepository')
    moduleUndeploymentsRepository = app.get<ModuleUndeploymentsRepository>(ModuleUndeploymentsRepository)
    httpService = app.get<HttpService>(HttpService)
    mooveService = app.get<MooveService>(MooveService)
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('/POST a circle undeploy callback fails should update status only the component and module that failed ', async() => {
    const cdConfiguration = await fixtureUtilsService.createCdConfiguration({
      id: uuid.v4(),
      workspaceId: uuid.v4(),
      type: CdTypeEnum.OCTOPIPE,
      configurationData: '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      name: 'config-name',
      authorId: 'author'
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

    const undeployment = await fixtureUtilsService.createUndeployment({
      'id': uuid.v4(),
      'deployment': deployment.id,
      'authorId': 'author-id',
      'status': 'CREATED',
      'circleId': '123456'
    })

    const moduleUndeployment = await fixtureUtilsService.createModuleUndeployment( {
      'id': uuid.v4(),
      'undeployment': undeployment.id,
      'moduleDeployment': 'module-deployment-id',
      'status': 'CREATED'
    })

    const moduleUndeployment2 = await fixtureUtilsService.createModuleUndeployment({
      'id': uuid.v4(),
      'undeployment': undeployment.id,
      'moduleDeployment': 'module-deployment-id2',
      'status': 'CREATED'
    })

    const componentDeployment = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': 'module-deployment-id',
      'componentId':  'component-id',
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    const componentDeployment2 = await fixtureUtilsService.createComponentDeployment({
      'id': uuid.v4(),
      'moduleDeployment': 'module-deployment-id',
      'componentId':  'component-id',
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': 'component-name',
      'status': 'CREATED'
    })

    const componentUndeployment = await fixtureUtilsService.createComponentUndeployment({
      'id': uuid.v4(),
      'moduleUndeployment': moduleUndeployment.id,
      'componentDeployment':  componentDeployment.id,
      'status': 'CREATED'
    })

    await fixtureUtilsService.createComponentUndeployment({
      'id': uuid.v4(),
      'moduleUndeployment': moduleUndeployment2.id,
      'componentDeployment':  componentDeployment2.id,
      'status': 'CREATED'
    })

    let queuedUndeployment = await fixtureUtilsService.createQueuedUndeployment({
      'componentId': 'component-id',
      'componentDeploymentId': componentDeployment.id,
      'status': 'RUNNING',
      'type': 'QueuedUndeploymentEntity',
      'componentUndeploymentId': componentUndeployment.id
    })

    const finishDeploymentDto = {
      status : 'FAILED'
    }

    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications/undeployment?queuedUndeploymentId=${queuedUndeployment.id}`)
      .send(finishDeploymentDto)

    queuedUndeployment = await queuedUndeploymentsRepository.
      findOneOrFail( {
        where : {
          componentUndeploymentId: queuedUndeployment.componentUndeploymentId,
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedUndeploymentEntity
        }
      })

    const componentUndeploymentEntity: ComponentUndeploymentEntity = await componentUndeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedUndeployment.componentUndeploymentId
        },
        relations: ['moduleUndeployment', 'moduleUndeployment.undeployment']
      })

    const moduleUndeploymentEntities : ModuleUndeploymentEntity[] = await moduleUndeploymentsRepository.find({
      where: {
        undeploymentId : componentUndeploymentEntity.moduleUndeployment.undeployment.id,
      },
      relations: ['componentUndeployments']
    })

    expect(queuedUndeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentUndeploymentEntity.status).toBe(DeploymentStatusEnum.FAILED)
    expect(moduleUndeploymentEntities[0].status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleUndeploymentEntities[0].componentUndeployments[0].status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleUndeploymentEntities[1].status).toBe(DeploymentStatusEnum.FAILED)
    expect(moduleUndeploymentEntities[1].componentUndeployments[0].status).toBe(DeploymentStatusEnum.FAILED)
    expect(spy).toBeCalled()
  })

  afterAll(async() => {
    await app.close()
  })
})
