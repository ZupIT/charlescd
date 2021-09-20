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
import { createDeployComponent, deploymentFixture, executionFixture } from '../../fixtures/deployment-entity.fixture'
import {
  routesManifests2ComponentsOneCircle,
  routesManifestsDiffNamespace,
  routesManifestsSameNamespace,
  routesManifestsSameNamespaceWithService,
  routesManifestsSameNamespaceWithServiceAndNoLabels
} from '../../fixtures/manifests.fixture'
import { ExecutionRepository } from '../../../../app/v2/api/deployments/repository/execution.repository'
import { MooveService } from '../../../../app/v2/core/integrations/moove'
import { HttpService } from '@nestjs/common'
import { UpdateResult } from 'typeorm'

describe('Hook Routes Manifest Creation', () => {

  let deploymentRepository: DeploymentRepositoryV2
  let componentsRepository: ComponentsRepositoryV2
  let consoleLoggerService: ConsoleLoggerService
  let hookParamsWithNoCircle: RouteHookParams
  let hookParamsWith2Components: RouteHookParams
  let hookParamsWith2Components1Observed: RouteHookParams
  let hookParamsWith2Components2Observed: RouteHookParams
  let executionRepository: ExecutionRepository
  let mooveService: MooveService
  beforeEach(() => {
    deploymentRepository = new DeploymentRepositoryV2()
    componentsRepository = new ComponentsRepositoryV2()
    consoleLoggerService = new ConsoleLoggerService()
    executionRepository = new ExecutionRepository(consoleLoggerService)
    mooveService = new MooveService(new HttpService(), consoleLoggerService)
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
    hookParamsWith2Components1Observed = {
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
        'DestinationRule.networking.istio.io/v1alpha3': {
          'namespace/A': {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'DestinationRule',
            metadata: {
              name: 'A',
              namespace: 'namespace',
              annotations: {
                circles: '["circle-2"]'
              }
            },
            spec: {
              host: 'A',
              subsets: []
            }
          }
        },
        'VirtualService.networking.istio.io/v1alpha3': {
          'namespace/A': {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'VirtualService',
            metadata: {
              name: 'A',
              namespace: 'namespace',
              annotations: {
                circles: '["circle-2"]'
              }
            },
            spec: {
              gateways: [],
              hosts: [],
              http: []
            }
          }
        }
      },
      finalizing: false
    }

    hookParamsWith2Components2Observed = {
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
        'DestinationRule.networking.istio.io/v1alpha3': {
          'namespace/A': {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'DestinationRule',
            metadata: {
              name: 'A',
              namespace: 'namespace',
              annotations: {
                circles: '["circle-2"]'
              }
            },
            spec: {
              host: 'A',
              subsets: []
            }
          },
          'namespace/B': {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'DestinationRule',
            metadata: {
              name: 'B',
              namespace: 'namespace',
              annotations: {
                circles: '["circle-2"]'
              }
            },
            spec: {
              host: 'B',
              subsets: []
            }
          }
        },
        'VirtualService.networking.istio.io/v1alpha3': {
          'namespace/A': {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'VirtualService',
            metadata: {
              name: 'A',
              namespace: 'namespace',
              annotations: {
                circles: '["circle-2"]'
              }
            },
            spec: {
              gateways: [],
              hosts: [],
              http: []
            }
          },
          'namespace/B': {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'VirtualService',
            metadata: {
              name: 'B',
              namespace: 'namespace',
              annotations: {
                circles: '["circle-2"]'
              }
            },
            spec: {
              gateways: [],
              hosts: [],
              http: []
            }
          }
        }
      },
      finalizing: false
    }
  })

  it('generate route manifest correctly with one component in two different circles and same namespace', async() => {
    const componentsCircle1 = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'noManifest', 'namespace', true)
    ]
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsCircle1 : componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsSameNamespace, resyncAfterSeconds: 5 })
  })

  it('throws exception when manifests generation fail', async() => {
    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(async() => { throw new Error('Error') })
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = routeUseCase.execute(hookParamsWith2Components)

    await expect(manifests).rejects.toThrowError()
  })

  it('generate route manifest correctly with kubernetes services manifests', async() => {
    const componentsCircle1WithService = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'simple', 'namespace', true)
    ]
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsCircle1WithService : componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsSameNamespaceWithService, resyncAfterSeconds: 5 })
  })

  it('generate route manifest correctly with same component in different namespaces', async() => {
    const componentsCircle1DiffNamespace = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'noManifest', 'diff-namespace', true)
    ]
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsCircle1DiffNamespace : componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsDiffNamespace, resyncAfterSeconds: 5 })
  })

  it('returns an empty array when no circles are observed in the charlesroutes resource', async() => {
    const findSpy = jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId')
    const unhealthySpy = jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
    const updateSpy = jest.spyOn(deploymentRepository, 'updateRouteStatus')

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWithNoCircle)

    expect(manifests).toEqual({ children: [], resyncAfterSeconds: 5 })
    expect(updateSpy).toHaveBeenCalledTimes(0)
    expect(findSpy).toHaveBeenCalledTimes(0)
    expect(unhealthySpy).toHaveBeenCalledTimes(0)
  })

  it('should create manifest metadata labels/namespace for the services when they dont exist', async() => {
    const componentsCircle1 = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'noLabels', 'namespace', true)
    ]

    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async(circleId) => circleId === 'circle-1' ? componentsCircle1 : componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsSameNamespaceWithServiceAndNoLabels, resyncAfterSeconds: 5 })
  })

  it('should return the desired state correctly when only one of the desired components have been observed', async() => {
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async() => componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components1Observed)

    expect(manifests).toEqual({ children: routesManifests2ComponentsOneCircle, resyncAfterSeconds: 5 })
  })

  it('should set routes health status false when only one of the desired components have been observed', async() => {
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async() => componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])

    const updateSpy =
      jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    await routeUseCase.execute(hookParamsWith2Components1Observed)

    expect(updateSpy).toHaveBeenCalledWith('circle-2', false)
  })

  it('should notify moove and  set routes health status true when all of the desired components have been observed', async() => {
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async() => componentsCircle2
    )
    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async() => [])
    jest.spyOn(deploymentRepository, 'findByCircleId')
      .mockImplementation(async() => deploymentFixture)
    jest.spyOn(executionRepository, 'findOneOrFail')
      .mockImplementation(async() => executionFixture() )

    jest.spyOn(executionRepository, 'update')
      .mockImplementation(async() => Promise.resolve({} as UpdateResult))
    const mooveSpy = jest.spyOn(mooveService, 'notifyDeploymentStatusV2')

    const updateSpy =
      jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    await routeUseCase.execute(hookParamsWith2Components2Observed)
    expect(mooveSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith('circle-2', true)
  })

  it('should create correct routes manifests when current deployment is not healthy a previous one exists on the same circle', async() => {
    const previousComponentsCircle1 = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'noManifest', 'namespace', true)
    ]
    const componentsCircle2 = [
      createDeployComponent('A', 'v2', 'circle-2', false, 'noManifest', 'namespace', true),
      createDeployComponent('B', 'v2', 'circle-2', false, 'noManifest', 'namespace', true)
    ]
    jest.spyOn(componentsRepository, 'findCurrentHealthyComponentsByCircleId').mockImplementation(
      async(circleId) =>   circleId === 'circle-1'? [] : componentsCircle2
    )

    jest.spyOn(componentsRepository, 'findPreviousComponentsFromCurrentUnhealthyByCircleId')
      .mockImplementation(async(circleId) => circleId === 'circle-1'? previousComponentsCircle1 : [])

    jest.spyOn(deploymentRepository, 'updateRouteStatus').mockImplementation(async() => deploymentFixture)

    const routeUseCase = new ReconcileRoutesUsecase(
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    const manifests = await routeUseCase.execute(hookParamsWith2Components)

    expect(manifests).toEqual({ children: routesManifestsSameNamespace, resyncAfterSeconds: 5 })
  })
})

describe('Compare observed routes state with desired routes state', () => {

  it('should return empty array when observed and desired states are empty', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const consoleLoggerService = new ConsoleLoggerService()
    const executionRepository = new ExecutionRepository(consoleLoggerService)
    const mooveService = new MooveService(new HttpService(), consoleLoggerService)
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
      consoleLoggerService,
      executionRepository,
      mooveService
    )

    expect(routeUseCase.getRoutesStatus(observed, desired)).toEqual([])
  })

  it('should return the objects with status true for all desired components', () => {
    const deploymentRepository = new DeploymentRepositoryV2()
    const componentsRepository = new ComponentsRepositoryV2()
    const consoleLoggerService = new ConsoleLoggerService()
    const executionRepository = new ExecutionRepository(consoleLoggerService)
    const mooveService = new MooveService(new HttpService(), consoleLoggerService)
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
          'namespace/abobora': {
            kind: 'DestinationRule',
            metadata: {
              name: 'abobora',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          },
          'namespace/jilo': {
            kind: 'DestinationRule',
            metadata: {
              name: 'jilo',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          }
        },
        'VirtualService.networking.istio.io/v1alpha3': {
          'namespace/abobora': {
            kind: 'VirtualService',
            metadata: {
              name: 'abobora',
              namespace: 'namespace',
              annotations: {
                circles: '["ad2a1669-34b8-4af2-b42c-acbad2ec6b60"]'
              }
            }
          },
          'namespace/jilo': {
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
      consoleLoggerService,
      executionRepository,
      mooveService
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
    const executionRepository = new ExecutionRepository(consoleLoggerService)
    const mooveService = new MooveService(new HttpService(), consoleLoggerService)
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
      consoleLoggerService,
      executionRepository,
      mooveService
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
