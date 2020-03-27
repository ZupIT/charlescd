import { HttpService } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { of } from 'rxjs'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { IOctopipeConfigurationData } from '../../../app/api/configurations/interfaces'
import { ComponentDeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import {
  ComponentDeploymentsRepository, ComponentUndeploymentsRepository, QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { PipelineErrorHandlerService, PipelineQueuesService } from '../../../app/api/deployments/services'
import { GitProviders } from '../../../app/core/integrations/configuration/interfaces/git-providers.type'
import { MooveService } from '../../../app/core/integrations/moove'
import { OctopipeService } from '../../../app/core/integrations/octopipe'
import { IOctopipePayload } from '../../../app/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { StatusManagementService } from '../../../app/core/services/deployments'
import {
  ComponentDeploymentsRepositoryStub, ComponentUndeploymentsRepositoryStub, DeploymentsRepositoryStub, QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
  ConsoleLoggerServiceStub, HttpServiceStub, MooveServiceStub, PipelineErrorHandlerServiceStub, PipelineQueuesServiceStub, StatusManagementServiceStub
} from '../../stubs/services'

describe('Spinnaker Service', () => {
  let octopipeService: OctopipeService
  let httpService: HttpService
  let queuedDeploymentsRepository: QueuedDeploymentsRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OctopipeService,
        { provide: HttpService, useClass: HttpServiceStub },
        { provide: StatusManagementService, useClass: StatusManagementServiceStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
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
    queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
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
        'helm-repository',
        [componentDeployment]
      )
      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const deploymentConfiguration: IOctopipeConfigurationData = {
        namespace: 'some-app-namespace',
        url: 'www.octopipe.com',
        gitProvider: GitProviders.GITHUB,
        gitToken: 'some-github-token',
        k8sConfig: 'kube-config-yaml'
      }

      const payload: IOctopipePayload =
        octopipeService.createPipelineConfigurationObject(
          pipelineOptions,
          deploymentConfiguration,
          'dummy-callback-url',
          moduleDeployment,
          'some-app-name'
        )

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProviders.GITHUB,
          token: 'some-github-token',
        },
        k8s: {
          config: 'kube-config-yaml'
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
            version: 'some-app-name-v1',
            versionUrl: 'version.url/tag:123'
          }
        ],
        webHookUrl: 'dummy-callback-url'
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('posts to octopipe server', async () => {
      const payload = {} as IOctopipePayload
      const configuration = { url: 'www.octopipe.com' } as IOctopipeConfigurationData
      jest.spyOn(httpService, 'post').mockImplementation(
        () => of({
          data: {
            id: 'some-pipeline-id'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        })
      )
      expect(
        await octopipeService.deploy(payload, 'deployment-id', 444, configuration)
      ).toEqual({ config: {}, data: { id: 'some-pipeline-id' }, headers: {}, status: 200, statusText: 'OK' })
    })

    it('should handle on octopipe deployment failure', async () => {
      const payload = {} as IOctopipePayload
      const configuration = { url: 'www.octopipe.com' } as IOctopipeConfigurationData
      jest.spyOn(httpService, 'post').mockImplementation(
        () => { throw new Error('bad request') }
      )

      jest.spyOn(queuedDeploymentsRepository, 'findOne').mockImplementation(
        () => Promise.resolve(new QueuedDeploymentEntity(
          'dummy-component-id',
          'dummy-component-deployment-id3',
          QueuedPipelineStatusEnum.QUEUED,
        ))
      )
      expect(
        await octopipeService.deploy(payload, 'deployment-id', 444, configuration)
      ).toEqual({ error: 'bad request' })
    })
  })
})
