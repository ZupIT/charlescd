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
  })

  it('/POST a istio deployment callback should not update deployment  status to SUCCEEDED if another istio queued deployment is RUNNING ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id',
      'SUCCEEDED'
    )

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      'component-id',
      'component-name',
      'SUCCEEDED'
    )

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      'component-id',
      'component-name2',
      'SUCCEEDED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      'component-id',
      componentDeploymentEntity1.id,
      'RUNNING'
    )

    const queuedIstioDeployment = await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      'component-id',
      componentDeploymentEntity2.id,
      'RUNNING'
    )

    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications/istio-deployment?queuedIstioDeploymentId=${queuedIstioDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedIstioDeployment.componentDeploymentId
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
          deploymentId: deployment.id,
        }
      })

    const deploymentEntity: DeploymentEntity  = await deploymentsRepository.findOneOrFail({ id : deployment.id })
    expect(deploymentEntity.status).toBe(DeploymentStatusEnum.CREATED)
    expect(queuedIstioDeploymentsUpdated[0].status).toBe(QueuedPipelineStatusEnum.RUNNING)
    expect(queuedIstioDeploymentsUpdated[1].status).toBe(QueuedPipelineStatusEnum.FINISHED)
    expect(queuedIstioDeploymentsUpdated[1].id).toBe(queuedIstioDeployment.id)
    expect(moduleDeploymentEntities[0].components[0].status).toBe(DeploymentStatusEnum.SUCCEEDED)
    expect(moduleDeploymentEntities[0].components[1].status).toBe(DeploymentStatusEnum.SUCCEEDED)

  })

  it('/POST a istio deployment callback should update deployment  status to SUCCEEDED if all istio queued deployments finished and all components are succeeded ', async() => {

    const cdConfiguration = await fixtureUtilsService.createCdConfigurationOctopipe()

    const deployment = await fixtureUtilsService.createCircleDeployment(cdConfiguration.id)

    const moduleDeployment = await fixtureUtilsService.createModuleDeployment(deployment.id,
      'module-id',
      'SUCCEEDED'
    )

    const componentDeploymentEntity1 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      'component-id',
      'component-name',
      'SUCCEEDED'
    )

    const componentDeploymentEntity2 = await fixtureUtilsService.createComponentDeployment(
      moduleDeployment.id,
      'component-id',
      'component-name2',
      'SUCCEEDED'
    )

    await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      'component-id',
      componentDeploymentEntity1.id,
      'FINISHED'
    )

    const queuedIstioDeployment = await fixtureUtilsService.createQueuedIstioDeployment(
      deployment.id,
      'component-id',
      componentDeploymentEntity2.id,
      'RUNNING'
    )
    const finishDeploymentDto = {
      status : 'SUCCEEDED'
    }

    jest.spyOn(httpService, 'post').
      mockImplementation( () => of({} as AxiosResponse) )

    await request(app.getHttpServer()).post(`/notifications/istio-deployment?queuedIstioDeploymentId=${queuedIstioDeployment.id}`)
      .send(finishDeploymentDto).expect(204)

    const queuedIstioDeploymentsUpdated: QueuedIstioDeploymentEntity[]  = await queuedIstioDeploymentsRepository.
      find( {
        where : {
          deploymentId: deployment.id,
        }
      })

    const componentDeploymentEntity: ComponentDeploymentEntity = await componentDeploymentsRepository.
      findOneOrFail({
        where : {
          id: queuedIstioDeployment.componentDeploymentId
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

    const deploymentEntity: DeploymentEntity  = await deploymentsRepository.findOneOrFail({
      id : queuedIstioDeployment.deploymentId
    })
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
