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

import 'jest'
import { CdConfigurationsRepository } from '../../../../app/v2/api/configurations/repository'
import { ComponentsRepositoryV2 } from '../../../../app/v2/api/deployments/repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { CreateRoutesManifestsUseCase } from '../../../../app/v2/operator/use-cases/create-routes-manifests.usecase'
import { cdConfigurationFixture, deployComponentsFixture, deploymentFixture } from '../../fixtures/deployment-entity.fixture'
import { routesManifests } from '../../fixtures/manifests.fixture'
import { DestinationRuleSpec, HookParams, RouteHookParams, VirtualServiceSpec } from '../../../../app/v2/operator/params.interface'
import { KubernetesManifest } from '../../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'

describe('Hook Routes Manifest Creation', () => {

  const deploymentRepository = new DeploymentRepositoryV2()
  const componentsRepository = new ComponentsRepositoryV2()
  const cdConfigurationsRepository = new CdConfigurationsRepository()
  const consoleLoggerService = new ConsoleLoggerService()

  let hookParams: RouteHookParams

  beforeEach(() => {
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => deploymentFixture)
    jest.spyOn(cdConfigurationsRepository, 'findDecrypted').mockImplementation(async() => cdConfigurationFixture)
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => deployComponentsFixture)

    hookParams = {
      controller: {},
      parent: {
        apiVersion: 'charlescd.io/v1',
        kind: 'CharlesRoutes',
        metadata: {},
        spec: {
          circles: [
            {
              components: [
                {
                  name: 'my-component',
                  tag: 'my-tag'
                }
              ],
              id: 'b46fd548-0082-4021-ba80-a50703c44a3b',
              default: false
            }
          ]
        }
      },
      children: {
        'VirtualService.networking.istio.io/v1beta1': {},
        'DestinationRule.networking.istio.io/v1beta1': {}
      },
      finalizing: true
    }
  })

  it('generate route manifest correctly', async() => {
    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    const manifests = await routeUseCase.execute(hookParams)

    expect(manifests).toEqual({ children: routesManifests })
  })

  it('throws exception when manifests generation fail', async() => {
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => { throw new Error('Error') })
    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    const manifests = routeUseCase.execute(hookParams)

    await expect(manifests).rejects.toThrowError()
  })
})


describe('Compare observed routes state with desired routes state', () => {
  it('should return true when observed and desired states are empty', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const cdConfigurationsRepository = new CdConfigurationsRepository()
    const consoleLoggerService = new ConsoleLoggerService()
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => deploymentFixture)
    jest.spyOn(cdConfigurationsRepository, 'findDecrypted').mockImplementation(async() => cdConfigurationFixture)
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => deployComponentsFixture)

    // const observed = { 'DestinationRule.networking.istio.iov1beta1: {}, 'VirtualService.networking.istio.iov1beta1: {} }
    const observed : RouteHookParams = {
      controller: {
        kind: 'CompositeController',
        apiVersion: 'metacontroller.k8s.io/v1alpha1',
        metadata: {
          name: 'charlesroutes-controller',
        },
        spec: {
          parentResource: {
            apiVersion: 'charlescd.io/v1',
            resource: 'charlesroutes'
          },
          childResources: [
            {
              apiVersion: 'networking.istio.io/v1beta1',
              resource: 'virtualservices',
              updateStrategy: {
                method: 'InPlace',
                statusChecks: {}
              }
            },
            {
              apiVersion: 'networking.istio.io/v1beta1',
              resource: 'destinationrules',
              updateStrategy: {
                method: 'InPlace',
                statusChecks: {}
              }
            }
          ],
          hooks: {
            sync: {
              webhook: {
                url: 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/routes/hook/reconcile'
              }
            }
          },
          generateSelector: true
        },
        status: {}
      },
      parent: {
        apiVersion: 'charlescd.io/v1',
        kind: 'CharlesRoutes',
        metadata: {
          name: 'abobora',
          namespace: 'default'
        },

        spec: {
          circles: [
            {
              components: [
                {
                  name: 'jilo',
                  tag: 'latest'
                },
                {
                  name: 'abobora',
                  tag: 'latest'
                }
              ],
              default: false,
              id: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
            }
          ]
        }
      },
      children: {
        'DestinationRule.networking.istio.io/v1beta1': {},
        'VirtualService.networking.istio.io/v1beta1': {}
      },
      finalizing: false
    }
    const desired : (VirtualServiceSpec | DestinationRuleSpec)[] = []
    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.checkRoutes(observed, desired)).toEqual([])

  })
  it('should return true when observed and desired states are empty', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const cdConfigurationsRepository = new CdConfigurationsRepository()
    const consoleLoggerService = new ConsoleLoggerService()
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => deploymentFixture)
    jest.spyOn(cdConfigurationsRepository, 'findDecrypted').mockImplementation(async() => cdConfigurationFixture)
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => deployComponentsFixture)


    const observed : RouteHookParams = {
      'controller': {
        'kind': 'CompositeController',
        'apiVersion': 'metacontroller.k8s.io/v1alpha1',
        'spec': {
          'parentResource': {
            'apiVersion': 'charlescd.io/v1',
            'resource': 'charlesroutes'
          },
          'childResources': [
            {
              'apiVersion': 'networking.istio.io/v1beta1',
              'resource': 'virtualservices',
              'updateStrategy': {
                'method': 'InPlace',
                'statusChecks': {}
              }
            },
            {
              'apiVersion': 'networking.istio.io/v1beta1',
              'resource': 'destinationrules',
              'updateStrategy': {
                'method': 'InPlace',
                'statusChecks': {}
              }
            }
          ],
          'hooks': {
            'sync': {
              'webhook': {
                'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/routes/hook/reconcile'
              }
            }
          },
          'generateSelector': true
        },
        'status': {}
      },
      'parent': {
        'apiVersion': 'charlescd.io/v1',
        'kind': 'CharlesRoutes',
        metadata: {
          name: 'default-routes',
          namespace: 'default'
        },
        'spec': {
          'circles': [
            {
              'components': [
                {
                  'name': 'jilo',
                  'tag': 'latest'
                },
                {
                  'name': 'abobora',
                  'tag': 'latest'
                }
              ],
              'default': false,
              'id': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
            }
          ]
        }
      },
      'children': {
        'DestinationRule.networking.istio.io/v1beta1': {
          'abobora': {
            'apiVersion': 'networking.istio.io/v1beta1',
            'kind': 'DestinationRule',
            metadata: {
              name: 'abobora',
              namespace: 'default'
            },
            'spec': {
              'host': 'abobora',
              'subsets': [
                {
                  'labels': {
                    'circleId': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
                    'component': 'abobora',
                    'tag': 'latest'
                  },
                  'name': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                }
              ]
            }
          },
          'jilo': {
            'apiVersion': 'networking.istio.io/v1beta1',
            'kind': 'DestinationRule',
            metadata: {
              name: 'abobora',
              namespace: 'default'
            },

            'spec': {
              'host': 'jilo',
              'subsets': [
                {
                  'labels': {
                    'circleId': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
                    'component': 'jilo',
                    'tag': 'latest'
                  },
                  'name': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                }
              ]
            }
          }
        },
        'VirtualService.networking.istio.io/v1beta1': {
          'abobora': {
            'apiVersion': 'networking.istio.io/v1beta1',
            'kind': 'VirtualService',
            metadata: {
              name: 'abobora',
              namespace: 'default'
            },

            'spec': {
              'gateways': [],
              'hosts': [
                'abobora'
              ],
              'http': [
                {
                  'match': [
                    {
                      'headers': {
                        'cookie': {
                          'regex': '.*x-circle-id=ad2a1669-34b8-4af2-b42c-acbad2ec6b60.*'
                        }
                      }
                    }
                  ],
                  'route': [
                    {
                      'destination': {
                        'host': 'abobora',
                        'subset': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                      },
                      'headers': {
                        'request': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        },
                        'response': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  'match': [
                    {
                      'headers': {
                        'x-circle-id': {
                          'exact': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                        }
                      }
                    }
                  ],
                  'route': [
                    {
                      'destination': {
                        'host': 'abobora',
                        'subset': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                      },
                      'headers': {
                        'request': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        },
                        'response': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          },
          'jilo': {
            'apiVersion': 'networking.istio.io/v1beta1',
            'kind': 'VirtualService',
            metadata: {
              name: 'jilo',
              namespace: 'default'
            },
            'spec': {
              'gateways': [],
              'hosts': [
                'jilo'
              ],
              'http': [
                {
                  'match': [
                    {
                      'headers': {
                        'cookie': {
                          'regex': '.*x-circle-id=ad2a1669-34b8-4af2-b42c-acbad2ec6b60.*'
                        }
                      }
                    }
                  ],
                  'route': [
                    {
                      'destination': {
                        'host': 'jilo',
                        'subset': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                      },
                      'headers': {
                        'request': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        },
                        'response': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  'match': [
                    {
                      'headers': {
                        'x-circle-id': {
                          'exact': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                        }
                      }
                    }
                  ],
                  'route': [
                    {
                      'destination': {
                        'host': 'jilo',
                        'subset': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                      },
                      'headers': {
                        'request': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        },
                        'response': {
                          'set': {
                            'x-circle-source': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      'finalizing': false
    }

    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.checkRoutes(observed, desired)).toEqual([
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        status: true
      }
    ])

  })
})
