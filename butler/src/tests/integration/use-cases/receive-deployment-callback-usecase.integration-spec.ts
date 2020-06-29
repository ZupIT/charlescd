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
import { CallbackTypeEnum } from '../../../app/api/notifications/enums/callback-type.enum'

describe('DeploymentCallbackUsecase Integration Test', () => {

    let app: INestApplication
    let fixtureUtilsService: FixtureUtilsService
    let queuedDeploymentsRepository: Repository<QueuedDeploymentEntity>
    let componentsRepository: Repository<ComponentEntity>
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let httpService: HttpService
    let mooveService: MooveService

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
        componentsRepository = app.get<Repository<ComponentEntity>>('ComponentEntityRepository')
        componentDeploymentsRepository = app.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
        queuedDeploymentsRepository = app.get<Repository<QueuedDeploymentEntity>>('QueuedDeploymentEntityRepository')
        httpService = app.get<HttpService>(HttpService)
        mooveService = app.get<MooveService>(MooveService)
    })

    beforeEach(async () => {
        await fixtureUtilsService.clearDatabase()
        await fixtureUtilsService.loadDatabase()
    })

    it.skip(`/POST  deploy/callback in circle success should update status and notify moove - notification happens only on istio deployment`, async () => {

        jest.spyOn(httpService, 'post').
            mockImplementation( () => of({} as AxiosResponse) )
        const finishDeploymentDto = {
            status : 'SUCCEEDED',
            callbackType: CallbackTypeEnum.DEPLOYMENT
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

        await request(app.getHttpServer()).post(`/notifications?queuedDeploymentId=${queuedDeploymentSearch.id}`)
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

    it(`/POST a default circle deploy  callback fails should update status and notify moove `, async () => {

        jest.spyOn(httpService, 'post').
            mockImplementation( () => of({} as AxiosResponse) )
        const finishDeploymentDto = {
            status : 'FAILED',
            callbackType: CallbackTypeEnum.DEPLOYMENT
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

        await request(app.getHttpServer()).post(`/notifications?queuedDeploymentId=${queuedDeploymentSearch.id}`)
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

    it(`/POST a default deploy callback success should update status and notify moove `, async () => {
        jest.spyOn(httpService, 'post').
            mockImplementation( () => of({} as AxiosResponse) )
        const finishDeploymentDto = {
            status : 'SUCCEEDED',
            callbackType: CallbackTypeEnum.DEPLOYMENT
        }
        let queuedDeploymentSearch: QueuedDeploymentEntity  = await queuedDeploymentsRepository.
            findOneOrFail( {
                where : {
                    componentDeploymentId: '8f6dc70d-e49e-4fb9-b92e-0d9cd3018428',
                    status: QueuedPipelineStatusEnum.RUNNING,
                    type: QueuedPipelineTypesEnum.QueuedDeploymentEntity
                }
            })

        await request(app.getHttpServer()).post(`/notifications?queuedDeploymentId=${queuedDeploymentSearch.id}`)
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

    it(`/POST a circle deploy callback fail should update status and notify moove `, async () => {

        jest.spyOn(httpService, 'post').
          mockImplementation( () => of({} as AxiosResponse) )
        const finishDeploymentDto = {
            status : 'FAILED',
            callbackType: CallbackTypeEnum.DEPLOYMENT
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

        await request(app.getHttpServer()).post(`/notifications?queuedDeploymentId=${queuedDeploymentSearch.id}`)
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

    it(`/POST deploy/callback in circle  should remove pipeline options when deployment failure`, async () => {
        jest.spyOn(httpService, 'post').
            mockImplementation( () => of({} as AxiosResponse) )
        const finishDeploymentDto = {
            status : 'FAILED',
            callbackType: CallbackTypeEnum.DEPLOYMENT
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

        await request(app.getHttpServer()).post(`/notifications?queuedDeploymentId=${queuedDeploymentSearch.id}`)
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

    afterAll(async () => {
        await app.close()
    })
})
