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
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedIstioDeploymentEntity } from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { ComponentDeploymentsRepository, QueuedIstioDeploymentsRepository } from '../../../app/api/deployments/repository'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { ModuleDeploymentsRepository } from '../../../app/api/deployments/repository/module-deployments.repository'

describe('IstioDeploymentCallbackUsecase Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let queuedIstioDeploymentsRepository: QueuedIstioDeploymentsRepository
  let deploymentsRepository: Repository<DeploymentEntity>
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let moduleDeploymentsRepository: ModuleDeploymentsRepository
  let httpService: HttpService

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
    componentDeploymentsRepository = app.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
    moduleDeploymentsRepository = app.get<ModuleDeploymentsRepository>(ModuleDeploymentsRepository)
    queuedIstioDeploymentsRepository = app.get<QueuedIstioDeploymentsRepository>(QueuedIstioDeploymentsRepository)
    httpService = app.get<HttpService>(HttpService)
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
    await fixtureUtilsService.loadDatabase()
  })

  it('/POST a istio deployment callback should not update deployment  status to SUCCEEDED if another istio queued deployment is RUNNING ', async() => {

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    const queuedIstioDeploymentSearch: QueuedIstioDeploymentEntity  = await queuedIstioDeploymentsRepository.
      findOneOrFail( {
        where : {
          deploymentId: 'a8b28b83-19d9-43a3-8695-7f33bd7e5e00',
          status: QueuedPipelineStatusEnum.RUNNING,
          componentDeploymentId: 'f4e6ec6a-e870-4299-972e-ae4fe90b9dc6'
        }
      })

    await request(app.getHttpServer()).post(`/notifications/istio-deployment?queuedIstioDeploymentId=${queuedIstioDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedIstioDeploymentSearch.componentDeploymentId
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

    const queuedIstioDeploymentsUpdated: QueuedIstioDeploymentEntity[]  = await queuedIstioDeploymentsRepository.
      find( {
        where : {
          deploymentId: 'a8b28b83-19d9-43a3-8695-7f33bd7e5e00',
        }
      })

    const deploymentEntity: DeploymentEntity  = await deploymentsRepository.findOneOrFail({ id : queuedIstioDeploymentSearch.deploymentId })
    expect(deploymentEntity.status).toBe(DeploymentStatusEnum.CREATED)
    expect(queuedIstioDeploymentsUpdated[0].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(queuedIstioDeploymentsUpdated[1].status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(queuedIstioDeploymentsUpdated[1].id).toBe(queuedIstioDeploymentSearch.id)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)

  })

  it('/POST a istio deployment callback should update deployment  status to SUCCEEDED if all istio queued deployments finished and all components are succeeded ', async() => {

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    const queuedIstioDeploymentSearch: QueuedIstioDeploymentEntity  = await queuedIstioDeploymentsRepository.
      findOneOrFail( {
        where : {
          deploymentId: '7c2617dc-e7b1-4ae2-924f-b3a8ccbb4762',
          status: QueuedPipelineStatusEnum.RUNNING,
          componentDeploymentId: '489e16fe-20f3-4c83-8c3a-59fb36517d1c'
        }
      })

    await request(app.getHttpServer()).post(`/notifications/istio-deployment?queuedIstioDeploymentId=${queuedIstioDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    const queuedIstioDeploymentsUpdated: QueuedIstioDeploymentEntity[]  = await queuedIstioDeploymentsRepository.
      find( {
        where : {
          deploymentId: '7c2617dc-e7b1-4ae2-924f-b3a8ccbb4762',
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedIstioDeploymentSearch.componentDeploymentId
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

    const deploymentEntity: DeploymentEntity  = await deploymentsRepository.findOneOrFail({ id : queuedIstioDeploymentSearch.deploymentId })
    expect(deploymentEntity.status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(queuedIstioDeploymentsUpdated[0].status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(queuedIstioDeploymentsUpdated[1].status).toBe(QueuedPipelineStatusEnum.FINISHED)
  })

  afterAll(async() => {
    await app.close()
  })
})
