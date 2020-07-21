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
import { ComponentDeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from '../../../app/v1/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../app/v1/api/deployments/enums'
import { ComponentDeploymentsRepository, QueuedIstioDeploymentsRepository } from '../../../app/v1/api/deployments/repository'
import { ComponentEntity } from '../../../app/v1/api/components/entity'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { MooveService } from '../../../app/v1/core/integrations/moove'
import { ModuleDeploymentsRepository } from '../../../app/v1/api/deployments/repository/module-deployments.repository'

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
    await fixtureUtilsService.loadDatabase()
  })

  it.skip('/POST  deploy/callback in circle success should update status and notify moove - notification happens only on istio deployment', async() => {

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '88a33b0c-c974-4ed7-8c49-c5fa342744af',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '88a33b0c-c974-4ed7-8c49-c5fa342744af',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(spy).toBeCalledTimes(1)
  })

  it('/POST a default circle deploy  callback fails should update status and notify moove ', async() => {

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED'
    }
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '8f6dc70d-e49e-4fb9-b92e-0d9cd3018428',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '8f6dc70d-e49e-4fb9-b92e-0d9cd3018428',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.FAILED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(spy).toBeCalled()
  })

  it('/POST a default deploy callback success should update status and notify moove ', async() => {
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }
    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '8f6dc70d-e49e-4fb9-b92e-0d9cd3018428',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '8f6dc70d-e49e-4fb9-b92e-0d9cd3018428',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.SUCCEEDED)
  })

  it('/POST a circle deploy callback fail should update status and notify moove ', async() => {

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED'
    }
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '88a33b0c-c974-4ed7-8c49-c5fa342744af',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '88a33b0c-c974-4ed7-8c49-c5fa342744af',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail( {
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
        },
        relations: ['moduleDeployment']
      })

    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(componentDeploymentEntity.status).toBe(DeploymentStatusEnum.FAILED)
    expect(componentDeploymentEntity.moduleDeployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(spy).toBeCalled()
  })

  it('/POST deploy/callback in circle  should remove pipeline options when deployment failure', async() => {
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED'
    }
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '88a33b0c-c974-4ed7-8c49-c5fa342744af',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '88a33b0c-c974-4ed7-8c49-c5fa342744af',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })
    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
        },
        relations: ['moduleDeployment'] }
      )
    const componentEntity: ComponentEntity = await componentsRepository.
      findOneOrFail({
        where : { id: componentDeploymentEntity.componentId } }
      )

    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)
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
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '065c8d19-734f-425c-addf-21307f407467',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '065c8d19-734f-425c-addf-21307f407467',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
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

    const deployment = componentDeploymentEntity.moduleDeployment.deployment
    expect(deployment.status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  it('/POST when all callbacks have success, each istio queued deployment should be RUNNING ', async() => {
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '065c8d19-734f-425c-addf-21307f407467',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '065c8d19-734f-425c-addf-21307f407467',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
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

    const deployment = componentDeploymentEntity.moduleDeployment.deployment
    const istioQueuedDeployments = await queuedIstioDeploymentsRepository.find({ where : { deploymentId : componentDeploymentEntity.moduleDeployment.deployment.id } })
    expect(deployment.status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(istioQueuedDeployments[0].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(istioQueuedDeployments[1].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(istioQueuedDeployments[2].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(istioQueuedDeployments[3].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  it('/POST when one callback fails, each istio queued deployment should be QUEUED ', async() => {
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED'
    }

    let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '065c8d19-734f-425c-addf-21307f407467',
          status: QueuedPipelineStatusEnum.RUNNING,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeploymentSearch.id}`)
      .send(finishDeploymentDto).expect(204)

    queuedDeploymentSearch = await queuedDeploymentsRepository.
      findOneOrFail( {
        where : {
          componentDeploymentId: '065c8d19-734f-425c-addf-21307f407467',
          status: QueuedPipelineStatusEnum.FINISHED,
          type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedDeploymentSearch.componentDeploymentId
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

    const deployment = componentDeploymentEntity.moduleDeployment.deployment
    const istioQueuedDeployments = await queuedIstioDeploymentsRepository.find({ where : { deploymentId : componentDeploymentEntity.moduleDeployment.deployment.id } })
    expect(deployment.status).toBe(DeploymentStatusEnum.FAILED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[1].status).toBe(DeploymentStatusEnum.FAILED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(istioQueuedDeployments[0].status).toBe(QueuedPipelineStatusEnum.QUEUED)
    expect(istioQueuedDeployments[1].status).toBe(QueuedPipelineStatusEnum.QUEUED)
    expect(istioQueuedDeployments[2].status).toBe(QueuedPipelineStatusEnum.QUEUED)
    expect(istioQueuedDeployments[3].status).toBe(QueuedPipelineStatusEnum.QUEUED)
    expect(queuedDeploymentSearch.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  afterAll(async() => {
    await app.close()
  })
})
