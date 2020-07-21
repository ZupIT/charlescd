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
import { ComponentDeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum, QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../../../app/api/deployments/enums'
import { ComponentDeploymentsRepository, QueuedIstioDeploymentsRepository } from '../../../app/api/deployments/repository'
import { ComponentEntity } from '../../../app/api/components/entity'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { MooveService } from '../../../app/core/integrations/moove'
import { ModuleDeploymentsRepository } from '../../../app/api/deployments/repository/module-deployments.repository'

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
    const component = await fixtureUtilsService.createComponent('module-id')

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createDefaultDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(
      deployment.id,
      'module-id',
      'CREATED'
    )

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'CREATED'
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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(
      deployment.id, 'module-id',
      'CREATED'
    )

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'CREATED'
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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(
      deployment.id,
      'module-id',
      'CREATED'
    )

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'CREATED'
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

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(
      deployment.id,
      'module-id',
      'CREATED'
    )

    const componentDeployment = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'CREATED'
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

  it('/POST when have success in all callbacks, deployment status should not Be SUCCEEDED yet ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const module = await fixtureUtilsService.createModule()

    const module2 = await fixtureUtilsService.createModule()

    const component = await fixtureUtilsService.createComponent(module.id)

    const component2 = await fixtureUtilsService.createComponent(module2.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id',
      'SUCCEEDED'
    )
    const moduleDeployment2 = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id2',
      'CREATED'
    )

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'SUCCEEDED'
    )

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment2.id,
      component2.id,
      'component-name2',
      'CREATED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      component.id,
      componentDeploymentEntity1.id,
      'QUEUED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      component2.id,
      componentDeploymentEntity2.id,
      'QUEUED'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component2.id,
      componentDeploymentEntity2.id,
      'RUNNING'
    )

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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

    expect(deployment.status).toBe(DeploymentStatusEnum.CREATED)
    console.log(moduleDeploymentEntities)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  it('/POST when all callbacks have success, each istio queued deployment should be RUNNING ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const module = await fixtureUtilsService.createModule()

    const module2 = await fixtureUtilsService.createModule()

    const component = await fixtureUtilsService.createComponent(module.id)

    const component2 = await fixtureUtilsService.createComponent(module2.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id',
      'SUCCEEDED'
    )
    const moduleDeployment2 = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id2',
      'CREATED'
    )

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'SUCCEEDED'
    )

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment2.id,
      component2.id,
      'component-name2',
      'CREATED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      component.id,
      componentDeploymentEntity1.id,
      'QUEUED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      component2.id,
      componentDeploymentEntity2.id,
      'QUEUED'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component2.id,
      componentDeploymentEntity2.id,
      'RUNNING'
    )
    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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
    expect(deployment.status).toBe(DeploymentStatusEnum.CREATED)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[1].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(istioQueuedDeployments[0].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(istioQueuedDeployments[1].status).toBe(QueuedPipelineStatusEnum.RUNNING)

    expect(queuedDeployment.status).toBe(QueuedPipelineStatusEnum.FINISHED)

  })

  it('/POST when one callback fails, each istio queued deployment should be QUEUED ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const module = await fixtureUtilsService.createModule()

    const module2 = await fixtureUtilsService.createModule()

    const component = await fixtureUtilsService.createComponent(module.id)

    const component2 = await fixtureUtilsService.createComponent(module2.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id',
      'SUCCEEDED'
    )
    const moduleDeployment2 = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id2',
      'CREATED'
    )

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      component.id,
      'component-name',
      'SUCCEEDED'
    )

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment2.id,
      component2.id,
      'component-name2',
      'CREATED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      component.id,
      componentDeploymentEntity1.id,
      'QUEUED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      component2.id,
      componentDeploymentEntity2.id,
      'QUEUED'
    )

    let queuedDeployment = await fixtureUtilsService.createQueuedDeployment(
      component2.id,
      componentDeploymentEntity2.id,
      'RUNNING'
    )

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )
    const finishDeploymentDto = {
      status : 'FAILED'
    }

    await request(app.getHttpServer()).post(`/notifications/deployment?queuedDeploymentId=${queuedDeployment.id}`)
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
