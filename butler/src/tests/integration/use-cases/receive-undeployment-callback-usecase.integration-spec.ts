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
import { ModuleUndeploymentsRepository } from '../../../app/v1/api/deployments/repository/module-undeployments.repository';

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
    await fixtureUtilsService.loadDatabase()
  })

  it('/POST a circle undeploy callback fails should update status only the component and module that failed ', async() => {

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED'
    }
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    let queuedDeploymentSearch: QueuedUndeploymentEntity  = await queuedUndeploymentsRepository.
      findOneOrFail( {
        where : {
          componentUndeploymentId: '00a86675-49a2-48ad-b46c-0fa437a3cd3b',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedUndeploymentEntity
        }
      })


    await request(app.getHttpServer()).post(`/notifications/undeployment?queuedUndeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto)

    queuedDeploymentSearch = await queuedUndeploymentsRepository.
      findOneOrFail( {
        where : {
          componentUndeploymentId: '00a86675-49a2-48ad-b46c-0fa437a3cd3b',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedUndeploymentEntity
        }
      })
    const componentUndeploymentEntity: ComponentUndeploymentEntity = await componentUndeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeploymentSearch.componentUndeploymentId
        },
        relations: ['moduleUndeployment', 'moduleUndeployment.undeployment']
      })
    const moduleUndeploymentEntities : ModuleUndeploymentEntity[] = await moduleUndeploymentsRepository.find({
      where: {
        undeploymentId : componentUndeploymentEntity.moduleUndeployment.undeployment.id,
      },
      relations: ['componentUndeployments']
    })
    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)
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
