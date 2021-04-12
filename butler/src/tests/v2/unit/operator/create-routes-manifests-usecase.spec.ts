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
import { ComponentsRepositoryV2 } from '../../../../app/v2/api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { RouteHookParams } from '../../../../app/v2/operator/interfaces/params.interface'
import { PartialRouteHookParams, SpecsUnion } from '../../../../app/v2/operator/interfaces/partial-params.interface'
import { ReconcileRoutesUsecase } from '../../../../app/v2/operator/use-cases/reconcile-routes.usecase'
import {
  componentsFixtureCircle1,
  componentsFixtureCircle1DiffNamespace,
  componentsFixtureCircle1WithService,
  componentsFixtureCircle2,
  deploymentFixture
} from '../../fixtures/deployment-entity.fixture'
import {
  routesManifestsDiffNamespace,
  routesManifestsSameNamespace,
  routesManifestsSameNamespaceWithService
} from '../../fixtures/manifests.fixture'

describe('Hook Routes Manifest Creation', () => {

  let deploymentRepository: DeploymentRepositoryV2
  let componentsRepository: ComponentsRepositoryV2
  let consoleLoggerService: ConsoleLoggerService
  let hookParamsWith2Components: RouteHookParams
  let hookParamsWithNoCircle: RouteHookParams

  beforeEach(() => {
    deploymentRepository = new DeploymentRepositoryV2()
    componentsRepository = new ComponentsRepositoryV2()
    consoleLoggerService = new ConsoleLoggerService()

    hookParamsWith2Components = {
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
                  name: 'A',
                  tag: 'v1'
                }
              ],
              id: 'circle-1',
              default: true
            },
            {
              components: [
                {
                  name: 'A',
                  tag: 'v2'
                },
                {
                  name: 'B',
                  tag: 'v2'
                }
              ],
              id: 'circle-2',
              default: false
            }
          ]
        }
      },
      children: {
        'VirtualService.networking.istio.io/v1alpha3': {},
        'DestinationRule.networking.istio.io/v1alpha3': {}
      },
      finalizing: false
    }
    hookParamsWithNoCircle = {
      controller: {},
      parent: {
        apiVersion: 'charlescd.io/v1',
        kind: 'CharlesRoutes',
        metadata: {},
        spec: {
          circles: []
        }
      },
      children: {
        'VirtualService.networking.istio.io/v1alpha3': {},
        'DestinationRule.networking.istio.io/v1alpha3': {}
      },
      finalizing: false
    }
  })

  it('generate route manifest correctly with one component in two different circles and same namespace', async() => {
    jest.spyOn(componentsRepository, 'findActiveComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsFixtureCircle1 : componentsFixtureCircle2
    )
    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsSameNamespace, resyncAfterSeconds: 5 })
  })

  it('throws exception when manifests generation fail', async() => {
    jest.spyOn(componentsRepository, 'findActiveComponentsByCircleId').mockImplementation(async() => { throw new Error('Error') })
    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    const manifests = routeUseCase.execute(hookParamsWith2Components)

    await expect(manifests).rejects.toThrowError()
  })

  it('generate route manifest correctly with kubernetes services manifests', async() => {
    jest.spyOn(componentsRepository, 'findActiveComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsFixtureCircle1WithService : componentsFixtureCircle2
    )
    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsSameNamespaceWithService, resyncAfterSeconds: 5 })
  })

  it('generate route manifest correctly with same component in different namespaces', async() => {
    jest.spyOn(componentsRepository, 'findActiveComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsFixtureCircle1DiffNamespace : componentsFixtureCircle2
    )
    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsDiffNamespace, resyncAfterSeconds: 5 })
  })

  it('returns an empty array when no circles are observed in the charlesroutes resource', async() => {
    const findSpy = jest.spyOn(componentsRepository, 'findActiveComponentsByCircleId')
    const updateSpy = jest.spyOn(deploymentRepository, 'updateRouteStatus')

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    const manifests = await routeUseCase.execute(hookParamsWithNoCircle)

    expect(manifests).toEqual({ children: [], resyncAfterSeconds: 5 })
    expect(updateSpy).toHaveBeenCalledTimes(0)
    expect(findSpy).toHaveBeenCalledTimes(0)
  })
})

describe('Compare observed routes state with desired routes state', () => {

  it('should return empty array when observed and desired states are empty', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const consoleLoggerService = new ConsoleLoggerService()

    const observed : PartialRouteHookParams = {
      parent: {
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
        'DestinationRule.networking.istio.io/v1alpha3': {},
        'VirtualService.networking.istio.io/v1alpha3': {}
      }
    }
    const desired : SpecsUnion[] = []
    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.getRoutesStatus(observed, desired)).toEqual([])
  })

  it('should return the objects with status true for all desired components', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const consoleLoggerService = new ConsoleLoggerService()

    const observed : PartialRouteHookParams = {
      parent: {
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
        'DestinationRule.networking.istio.io/v1alpha3': {
          abobora: {
            kind: 'DestinationRule',
            metadata: {
              name: 'abobora',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          },
          jilo: {
            kind: 'DestinationRule',
            metadata: {
              name: 'abobora',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          }
        },
        'VirtualService.networking.istio.io/v1alpha3': {
          abobora: {
            kind: 'VirtualService',
            metadata: {
              name: 'abobora',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          },
          jilo: {
            kind: 'VirtualService',
            metadata: {
              name: 'jilo',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          }
        }
      }
    }

    const desired : SpecsUnion[] = [
      {
        kind: 'DestinationRule',
        metadata: {
          name: 'jilo',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        }
      },
      {
        kind: 'VirtualService',
        metadata: {
          name: 'jilo',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        },
      },
      {
        kind: 'DestinationRule',
        metadata: {
          name: 'abobora',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        }
      },
      {
        kind: 'VirtualService',
        metadata: {
          name: 'abobora',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        }
      }
    ]

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.getRoutesStatus(observed, desired)).toEqual([
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'VirtualService',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'DestinationRule',
        status: true
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'VirtualService',
        status: true
      }
    ])
  })

  it('should return the objects with status false for all desired components when the observed state is does not have the routes', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const consoleLoggerService = new ConsoleLoggerService()


    const observed : PartialRouteHookParams = {
      parent: {
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
        'DestinationRule.networking.istio.io/v1alpha3': {},
        'VirtualService.networking.istio.io/v1alpha3': {}
      }
    }

    const desired : SpecsUnion[] = [
      {
        kind: 'DestinationRule',
        metadata: {
          name: 'jilo',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        }
      },
      {
        kind: 'VirtualService',
        metadata: {
          name: 'jilo',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        }
      },
      {
        kind: 'DestinationRule',
        metadata: {
          name: 'abobora',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        },
      },
      {
        kind: 'VirtualService',
        metadata: {
          name: 'abobora',
          namespace: 'namespace',
          annotations: {
            circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
          }
        }
      }
    ]
    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService
    )

    expect(routeUseCase.getRoutesStatus(observed, desired)).toEqual([
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'DestinationRule',
        status: false
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'jilo',
        kind: 'VirtualService',
        status: false
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'DestinationRule',
        status: false
      },
      {
        circle: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        component: 'abobora',
        kind: 'VirtualService',
        status: false
      }
    ])
  })
})
