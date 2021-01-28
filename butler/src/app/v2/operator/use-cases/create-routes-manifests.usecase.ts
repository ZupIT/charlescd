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

import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import { Injectable } from '@nestjs/common'
import { CdConfigurationsRepository } from '../../api/configurations/repository'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { Component } from '../../api/deployments/interfaces'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { DeploymentUtils } from '../../core/integrations/utils/deployment.utils'
import { IstioDeploymentManifestsUtils } from '../../core/integrations/utils/istio-deployment-manifests.utils'
import { ConsoleLoggerService } from '../../core/logs/console'
import { RouteHookParams } from '../params.interface'

@Injectable()
export class CreateRoutesManifestsUseCase {

  constructor(
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentsRepository: ComponentsRepositoryV2,
    private readonly cdConfigurationsRepository: CdConfigurationsRepository,
    private readonly consoleLoggerService: ConsoleLoggerService,
  ) { }

  public async execute(hookParams: RouteHookParams): Promise<KubernetesObject[]> {
    this.consoleLoggerService.log('START:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE')
    const specs = Promise.all(hookParams.parent.spec.circles.flatMap(async c => {
      const deployment = await this.retriveDeploymentFor(c.id)
      const activeComponents = await this.componentsRepository.findActiveComponents(deployment.cdConfiguration.id)
      const proxySpecs = this.createProxySpecsFor(deployment, activeComponents)
      this.consoleLoggerService.log('FINISH:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE')
      return proxySpecs
    })).then(s => s.flat())

    return specs
  }

  private async retriveDeploymentFor(id: string): Promise<DeploymentEntityV2> {
    const deployment = await this.deploymentRepository.findOneOrFail({ circleId: id, current: true }, { relations: ['cdConfiguration', 'components'] })

    if (deployment) {
      deployment.cdConfiguration = await this.cdConfigurationsRepository.findDecrypted(deployment.cdConfiguration.id)
    }

    return deployment
  }

  private createProxySpecsFor(deployment: DeploymentEntityV2, activeComponents: Component[]): KubernetesManifest[] {
    const proxySpecs: KubernetesManifest[] = []
    deployment.components.forEach(component => {
      const manifests = this.createIstioProxiesManifestsFor(deployment, component, activeComponents)
      manifests.forEach(m => proxySpecs.push(m))
    })
    return proxySpecs
  }

  private createIstioProxiesManifestsFor(deployment: DeploymentEntityV2,
    newComponent: Component,
    activeComponents: Component[]
  ): [KubernetesManifest, KubernetesManifest] {
    const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, newComponent.name)
    const destinationRules = IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
    const virtualService = IstioDeploymentManifestsUtils.getVirtualServiceManifest(deployment, newComponent, activeByName)
    return [destinationRules, virtualService]
  }
}


const spec = (circleId: string) : Record<string, unknown>[] => {
  return [
    {
      'apiVersion': 'apps/v1',
      'kind': 'Deployment',
      'metadata': {
        'name': `my-release-name-${circleId}`,
        'namespace': 'default',
        'labels': {
          'app': `charlescd-ui-${circleId}`,
          'version': `my-release-name-${circleId}`,
          'component': 'front',
          'tag': 'v1',
          'circleId': circleId
        }
      },
      'spec': {
        'replicas': 1,
        'selector': {
          'matchLabels': {
            'app': `charlescd-ui-${circleId}`,
            'version': `my-release-name-${circleId}`,
            'component': 'front',
            'tag': 'v1',
            'circleId': circleId
          }
        },
        'template': {
          'metadata': {
            'annotations': {
              'sidecar.istio.io/inject': 'true'
            },
            'labels': {
              'app': `charlescd-ui-${circleId}`,
              'version': `my-release-name-${circleId}`,
              'component': 'front',
              'tag': 'v1',
              'circleId': circleId
            }
          },
          'spec': {
            'serviceAccountName': 'default',
            'containers': [
              {
                'name': 'darwin-ui-new-web',
                'image': 'hashicorp/http-echo',
                'args': ['-text', 'hello world'],
                'livenessProbe': {
                  'failureThreshold': 3,
                  'httpGet': {
                    'path': '/',
                    'port': 5678,
                    'scheme': 'HTTP'
                  },
                  'initialDelaySeconds': 20,
                  'periodSeconds': 20,
                  'successThreshold': 1,
                  'timeoutSeconds': 1
                },
                'readinessProbe': {
                  'failureThreshold': 3,
                  'httpGet': {
                    'path': '/',
                    'port': 5678,
                    'scheme': 'HTTP'
                  },
                  'initialDelaySeconds': 20,
                  'periodSeconds': 20,
                  'successThreshold': 1,
                  'timeoutSeconds': 1
                },
                'resources': {
                  'limits': {
                    'cpu': '512m',
                    'memory': '512Mi'
                  },
                  'requests': {
                    'cpu': '128m',
                    'memory': '128Mi'
                  }
                }
              }
            ]
          }
        }
      }
    },
    {
      'apiVersion': 'v1',
      'kind': 'Service',
      'metadata': {
        'labels': {
          'app': `charlescd-ui-${circleId}`,
          'service': `charlescd-ui-${circleId}`
        },
        'name': `charlescd-ui-${circleId}`,
        'namespace': 'default'
      },
      'spec': {
        'ports': [
          {
            'name': 'http',
            'port': 3000,
            'targetPort': 3000
          }
        ],
        'selector': {
          'app': `charlescd-ui-${circleId}`
        }
      }
    }
  ]
}

const specs = [
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
                  'regex': '.*x-circle-id=ed2a1669-34b8-4af2-b42c-acbad2ec6b60.*'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'jilo',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'exact': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'jilo',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'regex': '.*x-circle-id=ed2a1669-34b8-4af2-b42c-acbad2ec6b60.*'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'abobora',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'exact': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'abobora',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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




const specsFull = [
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
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          },
          'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'regex': '.*x-circle-id=ed2a1669-34b8-4af2-b42c-acbad2ec6b60.*'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'jilo',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'exact': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'jilo',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          },
          'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'regex': '.*x-circle-id=ed2a1669-34b8-4af2-b42c-acbad2ec6b60.*'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'abobora',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
                  'exact': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                }
              }
            }
          ],
          'route': [
            {
              'destination': {
                'host': 'abobora',
                'subset': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
              },
              'headers': {
                'request': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
                  }
                },
                'response': {
                  'set': {
                    'x-circle-source': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
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
