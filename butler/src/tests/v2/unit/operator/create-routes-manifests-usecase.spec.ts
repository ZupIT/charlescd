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
import { RouteHookParams } from '../../../../app/v2/operator/params.interface'
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

    const observed = { 'DestinationRule.networking.istio.io/v1beta1':{}, 'VirtualService.networking.istio.io/v1beta1':{} }
    const desired : KubernetesManifest[] = []
    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.checkRoutes(observed, desired)).toEqual(true)

  })
  it.skip('should return true when observed and desired states are empty', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const cdConfigurationsRepository = new CdConfigurationsRepository()
    const consoleLoggerService = new ConsoleLoggerService()
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => deploymentFixture)
    jest.spyOn(cdConfigurationsRepository, 'findDecrypted').mockImplementation(async() => cdConfigurationFixture)
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => deployComponentsFixture)


    const observed = {
      'DestinationRule.networking.istio.io/v1beta1': {
        'abobora': {
          'apiVersion': 'networking.istio.io/v1beta1',
          'kind': 'DestinationRule',
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
    }
    const desired = [
      {
        'apiVersion': 'networking.istio.io/v1beta1',
        'kind': 'DestinationRule',
        'metadata': {
          'name': 'jilo',
          'namespace': 'default'
        },
        'spec': {
          'host': 'jilo',
          'subsets': [
            {
              'labels': {
                'component': 'jilo',
                'tag': 'latest',
                'circleId': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'name': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
            }
          ]
        }
      },
      {
        'apiVersion': 'networking.istio.io/v1beta1',
        'kind': 'VirtualService',
        'metadata': {
          'name': 'jilo',
          'namespace': 'default'
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
      },
      {
        'apiVersion': 'networking.istio.io/v1beta1',
        'kind': 'DestinationRule',
        'metadata': {
          'name': 'abobora',
          'namespace': 'default'
        },
        'spec': {
          'host': 'abobora',
          'subsets': [
            {
              'labels': {
                'component': 'abobora',
                'tag': 'latest',
                'circleId': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'name': 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
            }
          ]
        }
      },
      {
        'apiVersion': 'networking.istio.io/v1beta1',
        'kind': 'VirtualService',
        'metadata': {
          'name': 'abobora',
          'namespace': 'default'
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
      }
    ]

    const routeUseCase = new CreateRoutesManifestsUseCase(
      deploymentRepository,
      componentsRepository,
      cdConfigurationsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.checkRoutes(observed, desired)).toEqual(true)

  })
})
