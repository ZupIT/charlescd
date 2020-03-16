import { HttpService } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AxiosResponse } from 'axios'
import { Repository } from 'typeorm'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../../../app/api/deployments/entity'
import {
  ComponentDeploymentsRepository, ComponentUndeploymentsRepository, QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { PipelineErrorHandlerService, PipelineQueuesService } from '../../../app/api/deployments/services'
import { AppConstants } from '../../../app/core/constants'
import { MooveService } from '../../../app/core/integrations/moove'
import { OctopipeService } from '../../../app/core/integrations/octopipe'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { ConsulConfigurationStub } from '../../stubs/configurations'
import {
  ComponentDeploymentsRepositoryStub, ComponentUndeploymentsRepositoryStub, DeploymentsRepositoryStub, QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
  ConsoleLoggerServiceStub, HttpServiceStub, MooveServiceStub, PipelineErrorHandlerServiceStub, PipelineQueuesServiceStub, StatusManagementServiceStub
} from '../../stubs/services'

describe('Spinnaker Service', () => {
  let octopipeService: OctopipeService
  let httpService: HttpService
  let defaultAxiosGetResponse: AxiosResponse
  let defaultAxiosPostResponse: AxiosResponse
  let deploymentsRepository: Repository<DeploymentEntity>
  let statusManagementService: StatusManagementService
  let mooveService: MooveService
  let pipelineQueuesService: PipelineQueuesService
  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let componentUndeploymentsRepository: ComponentUndeploymentsRepository
  let pipelineErrorHandlerService: PipelineErrorHandlerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OctopipeService,
        { provide: HttpService, useClass: HttpServiceStub },
        { provide: StatusManagementService, useClass: StatusManagementServiceStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: AppConstants.CONSUL_PROVIDER, useValue: ConsulConfigurationStub },
        { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
        { provide: MooveService, useClass: MooveServiceStub },
        { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
        { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
        { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
        { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub }
      ]
    }).compile()

    octopipeService = module.get<OctopipeService>(OctopipeService)
    httpService = module.get<HttpService>(HttpService)
    deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
    statusManagementService = module.get<StatusManagementService>(StatusManagementService)
    mooveService = module.get<MooveService>(MooveService)
    pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
    queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
    componentUndeploymentsRepository = module.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)
    pipelineErrorHandlerService = module.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)

    defaultAxiosGetResponse = {
      data: {
        id: 'some-pipeline-id',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }

    defaultAxiosPostResponse = {
      data: {
        id: 'some-pipeline-id',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }
  })

  describe('deploySpinnakerPipeline', () => {

    it('should create the right payload', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'dummy-name2',
        'dummy-img-url2',
        'dummy-img-tag2',
        'dummy-context-path2',
        'dummy-health-check2',
        1001
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const deploymentConfiguration = {
        account: 'some-account',
        pipelineName: 'some-pipeline-name',
        applicationName: 'some-application-name',
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        healthCheckPath: '/health',
        uri: { uriName: 'https://some.uri' },
        appPort: 8989
      }
      const payload =
        octopipeService.createPipelineConfigurationObject(pipelineOptions, deploymentConfiguration, 'dummy-callback-url', moduleDeployment)

      const expectedPayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        github: {
          username: 'aaa',
          password: 'bbb'
        },
        helmUrl: 'helm-repository',
        istio: {
          virtualService: {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'VirtualService',
            metadata: {
              name: 'some-app-name',
              namespace: 'some-app-namespace'
            },
            spec: {
              hosts: [
                'some-app-name'
              ],
              http: [
                {
                  match: [
                    {
                      headers: {
                        cookie: {
                          regex: '.*x-circle-id=dummy-value.*'
                        }
                      }
                    }
                  ],
                  route: [
                    {
                      destination: {
                        host: 'some-app-name',
                        subset: 'v1'
                      },
                      headers: {
                        request: {
                          set: {
                            'x-circle-source': 'dummy-value'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  match: [
                    {
                      headers: {
                        'x-dummy-header': {
                          exact: 'dummy-value'
                        }
                      }
                    }
                  ],
                  route: [
                    {
                      destination: {
                        host: 'some-app-name',
                        subset: 'v1'
                      },
                      headers: {
                        request: {
                          set: {
                            'x-circle-source': 'dummy-value'
                          }
                        }
                      }
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
              name: 'some-app-name',
              namespace: 'some-app-namespace'
            },
            spec: {
              host: 'some-app-name',
              subsets: [
                {
                  labels: {
                    version: 'some-app-name-v1'
                  },
                  name: 'v1'
                }
              ]
            }
          }
        },
        unusedVersions: [],
        versions: [
          {
            version: 'v1',
            versionUrl: 'version.url/tag:123'
          }
        ],
        webHookUrl: 'dummy-callback-url'
      }
      expect(payload).toEqual(expectedPayload)
    })
  })
})
