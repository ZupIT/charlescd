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
import { ComponentDeploymentEntity, QueuedDeploymentEntity } from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../app/api/deployments/enums'
import { ComponentDeploymentsRepository } from '../../../app/api/deployments/repository'
import { ComponentEntity } from '../../../app/api/components/entity'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { MooveService } from '../../../app/core/integrations/moove'

describe('DeploymentCallbackUsecase Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let queuedDeploymentsRepository: Repository<QueuedDeploymentEntity>
  let componentsRepository: Repository<ComponentEntity>
  let componentDeploymentsRepository: ComponentDeploymentsRepository
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
    queuedDeploymentsRepository = app.get<Repository<QueuedDeploymentEntity>>('QueuedDeploymentEntityRepository')
    httpService = app.get<HttpService>(HttpService)
    mooveService = app.get<MooveService>(MooveService)
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('/POST a default circle deploy  callback fails should update status and notify moove ', async() => {
    const component = await fixtureUtilsService.createComponent('module-id')

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createDefaultDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id, 'module-id')

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component.id,
      componentDeployment.id,
      'RUNNING'
    )

    const finishDeploymentDto = {
      status : 'FAILED'
    }

    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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
    const component = await fixtureUtilsService.createComponent('module-id')

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createDefaultDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id, 'module-id')

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component.id,
      componentDeployment.id,
      'RUNNING'
    )

    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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
    const component = await fixtureUtilsService.createComponent('module-id')

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id, 'module-id')

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component.id,
      componentDeployment.id,
      'RUNNING'
    )

    const finishDeploymentDto = {
      status : 'FAILED'
    }

    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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

    const component = await fixtureUtilsService.createComponent('module-id')

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id, 'module-id')

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component.id,
      componentDeployment.id,
      'RUNNING'
    )

    const finishDeploymentDto = {
      status : 'FAILED'
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const spy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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
      findOneOrFail({
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

  afterAll(async() => {
    await app.close()
  })
})
