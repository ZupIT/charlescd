import { Test } from '@nestjs/testing'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { OctopipeConfigurationData } from '../../../app/api/configurations/interfaces'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../../../app/api/deployments/entity'
import { IoCTokensConstants } from '../../../app/core/constants/ioc'
import { IConnectorConfiguration } from '../../../app/core/integrations/cd/interfaces'
import { OctopipeService } from '../../../app/core/integrations/cd/octopipe'
import { OctopipeApiService } from '../../../app/core/integrations/cd/octopipe/octopipe-api.service'
import { GitProvidersEnum } from '../../../app/core/integrations/configuration/interfaces'
import { IOctopipePayload, ClusterProviderEnum } from '../../../app/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { EnvConfigurationStub } from '../../stubs/configurations'
import { ConsoleLoggerServiceStub, OctopipeApiServiceStub } from '../../stubs/services'

describe('Octopipe Service', () => {
  let octopipeService: OctopipeService
  let octopipeApiService: OctopipeApiService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OctopipeService,
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: IoCTokensConstants.ENV_CONFIGURATION, useValue: EnvConfigurationStub },
        { provide: OctopipeApiService, useClass: OctopipeApiServiceStub }
      ]
    }).compile()

    octopipeService = module.get<OctopipeService>(OctopipeService)
    octopipeApiService = module.get<OctopipeApiService>(OctopipeApiService)
  })

  describe('octopipeService', () => {

    it('should create the right payload for EKS config', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2'
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id'
      )

      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment

      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.EKS,
        awsClusterName: 'cluster-name',
        awsRegion: 'region',
        awsSID: 'sid',
        awsSecret: 'secret',
        gitProvider: GitProvidersEnum.GITHUB,
        gitToken: 'some-github-token',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url'
      }

      const payload = octopipeService.createPipelineConfigurationObject(connectorConfiguration)

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProvidersEnum.GITHUB,
          token: 'some-github-token',
        },
        k8s: {
          provider: ClusterProviderEnum.EKS,
          awsClusterName: 'cluster-name',
          awsRegion: 'region',
          awsSID: 'sid',
          awsSecret: 'secret',
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
        webHookUrl: 'dummy-callback-url',
        circleId: 'circle-id'
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('should create the right payload for GENERIC config', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2'
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id'
      )

      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment

      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.GENERIC,
        clientCertificate: 'client-cert',
        clientKey: 'client-key',
        gitProvider: GitProvidersEnum.GITHUB,
        caData: 'ca-data',
        gitToken: 'some-github-token',
        host: 'https://k8s.com',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url'
      }

      const payload = octopipeService.createPipelineConfigurationObject(connectorConfiguration)

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProvidersEnum.GITHUB,
          token: 'some-github-token',
        },
        k8s: {
          provider: ClusterProviderEnum.GENERIC,
          clientCertificate: 'client-cert',
          caData: 'ca-data',
          clientKey: 'client-key',
          host: 'https://k8s.com',
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
        webHookUrl: 'dummy-callback-url',
        circleId: 'circle-id'
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('should create the right payload for DEFAULT config', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2'
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id'
      )

      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment

      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.DEFAULT,
        gitProvider: GitProvidersEnum.GITHUB,
        gitToken: 'some-github-token',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url'
      }

      const payload = octopipeService.createPipelineConfigurationObject(connectorConfiguration)

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProvidersEnum.GITHUB,
          token: 'some-github-token',
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
        webHookUrl: 'dummy-callback-url',
        circleId: 'circle-id'
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('posts to octopipe server', async () => {
      const payload = {} as IOctopipePayload
      jest.spyOn(octopipeApiService, 'deploy').mockImplementation(
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
        await octopipeService.deploy(payload)
      ).toEqual({ config: {}, data: { id: 'some-pipeline-id' }, headers: {}, status: 200, statusText: 'OK' })
    })

    it('should handle on octopipe deployment failure', async () => {
      const payload = {} as IOctopipePayload
      jest.spyOn(octopipeApiService, 'deploy').mockImplementation(
        () => { throw new Error('bad request') }
      )
      await expect(octopipeService.deploy(payload)).rejects.toThrow()
    })
  })
})
