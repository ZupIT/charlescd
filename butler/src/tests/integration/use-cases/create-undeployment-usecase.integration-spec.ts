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
import { DeploymentEntity, ModuleUndeploymentEntity, UndeploymentEntity} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { QueuedDeploymentsRepository} from '../../../app/api/deployments/repository'
import { IoCTokensConstants } from '../../../app/core/constants/ioc'
import IEnvConfiguration from '../../../app/core/integrations/configuration/interfaces/env-configuration.interface'
import {
  DeploymentStatusEnum,
  QueuedPipelineStatusEnum,
  UndeploymentStatusEnum
} from '../../../app/api/deployments/enums'
import { OctopipeApiService } from '../../../app/core/integrations/cd/octopipe/octopipe-api.service'
import {  of } from 'rxjs'
import { PipelineErrorHandlerService } from '../../../app/api/deployments/services'

import { ModuleUndeploymentsRepository } from '../../../app/api/deployments/repository/module-undeployments.repository'
import { UndeploymentsRepository } from '../../../app/api/deployments/repository/undeployments.repository';

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
        undeploymentsRepository = app.get<UndeploymentsRepository>(UndeploymentsRepository)
        deploymentsRepository = app.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        moduleUndeploymentsRepository = app.get<ModuleUndeploymentsRepository>(ModuleUndeploymentsRepository)
        queuedDeploymentsRepository = app.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        envConfiguration = app.get(IoCTokensConstants.ENV_CONFIGURATION)
        httpService = app.get<HttpService>(HttpService)
        octopipeApiService = app.get<OctopipeApiService>(OctopipeApiService)
        pipelineErrorHandlerService = app.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)
    })

    beforeEach(async () => {
        await fixtureUtilsService.clearDatabase()
        await fixtureUtilsService.loadDatabase()
    })

    it(`/POST undeploy should call octopipe for each RUNNING component undeployment`, async () => {

        jest.spyOn(octopipeApiService, 'deploy').
        mockImplementation( () => of({} as AxiosResponse))

        const createUndeploymentRequest = {
            authorId : 'author-id',
            deploymentId : 'a17d4352-568a-4abb-a45a-a03da11c80b8'
        }
        const octopipeServiceSpy = jest.spyOn(octopipeApiService, 'deploy')

        await request(app.getHttpServer()).post(`/undeployments`).send(createUndeploymentRequest).expect(201)
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
        }
        expect(octopipeServiceSpy).toHaveBeenCalledWith(
          expectedOctopipePayload2
        )

    })

    it(`/POST /undeploy should create undeployment, componentundeployment and moduleundeployment of a circle deployment`, async () => {

        const createUndeploymentRequest = {
            authorId : 'author-id',
            deploymentId: '2adc7ac1-61ff-4630-8ba9-eba33c00ad24'
        }
        const { body: responseData } = await request(app.getHttpServer()).post(`/undeployments`).send(createUndeploymentRequest)
        const undeployment = responseData
        const deployment = await deploymentsRepository.findOne(
            { id: createUndeploymentRequest.deploymentId },
            { relations: ['modules', 'modules.components'] }
        )

        if (!undeployment) {
            fail('Undeployment was not saved')
        }
        if (!deployment) {
            fail('Undeployment has no deployment')
        }
        expect(undeployment).toMatchObject({
            authorId: createUndeploymentRequest.authorId,
            modulesUndeployments: [{
                moduleUndeployment: deployment.modules[0].id,
                componentsUndeployments: [
                    {
                        componentDeployment: deployment.modules[0].components[0].id,
                        status: UndeploymentStatusEnum.CREATED
                    }
                ]
            }],
            deployment: deployment.id
        })

    })

    it(`/POST /undeploy should fail when creating undeploy on  default circle `, async () => {

        const createUndeploymentRequest = {
            authorId : 'author-id',
            deploymentId : '014742a1-34a6-46b5-a24e-1a61ce945803'
        }
        await request(app.getHttpServer()).post(`/undeployments`).send(createUndeploymentRequest).expect(400)
    })

    it(`/POST /undeploy should enqueue QUEUED and RUNNING component undeployments correctly`, async () => {

        jest.spyOn(octopipeApiService, 'deploy')
          .mockImplementation( () => of({} as AxiosResponse))
        const createUndeploymentRequest = {
            authorId : 'author-id',
            deploymentId : 'a17d4352-568a-4abb-a45a-a03da11c80b8'
        }

        const { body: responseData } = await request(app.getHttpServer()).post(`/undeployments`).send(createUndeploymentRequest).expect(201)
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

    it(`/POST /undeploy should handle  undeployment  failure`, async () => {

        jest.spyOn(octopipeApiService, 'deploy').
        mockImplementation( () => { throw new Error() })
        jest.spyOn(httpService, 'post').
        mockImplementation( () => of({} as AxiosResponse) )
        const spyHandleUndeployment = jest.spyOn(pipelineErrorHandlerService, 'handleUndeploymentFailure')
        const spyHandleComponentUndeployment = jest.spyOn(pipelineErrorHandlerService, 'handleComponentUndeploymentFailure')
        const createUndeploymentRequest = {
            authorId : 'author-id',
            deploymentId: 'a17d4352-568a-4abb-a45a-a03da11c80b8'
        }

        await request(app.getHttpServer()).post('/undeployments').send(createUndeploymentRequest).expect(500)
        const undeployment: UndeploymentEntity = await undeploymentsRepository.findOneOrFail({ where: { deploymentId: createUndeploymentRequest.deploymentId } })
        const moduleUndeployment: ModuleUndeploymentEntity[] = await moduleUndeploymentsRepository.find({ where : { undeploymentId: undeployment.id } , relations: ['componentUndeployments'] })

        expect(spyHandleUndeployment).toHaveBeenCalledTimes(3)
        expect(spyHandleComponentUndeployment).toHaveBeenCalledTimes(2)
        expect(undeployment.status).toBe(UndeploymentStatusEnum.FAILED)
        expect(moduleUndeployment[0].status).toBe(UndeploymentStatusEnum.CREATED)
        expect(moduleUndeployment[1].status).toBe(UndeploymentStatusEnum.CREATED)
        expect(moduleUndeployment[2].status).toBe(UndeploymentStatusEnum.FAILED)
        expect(moduleUndeployment[3].status).toBe(UndeploymentStatusEnum.CREATED)
        expect(moduleUndeployment[4].status).toBe(UndeploymentStatusEnum.CREATED)

    })

    afterAll(async () => {
        await app.close()
    })
})
