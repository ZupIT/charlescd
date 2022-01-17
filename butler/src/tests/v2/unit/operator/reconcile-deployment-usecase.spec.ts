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
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import {
  createDeployComponent,
  getDeploymentWithManifestAndPreviousFixture,
  getDeploymentWithManifestFixture
} from '../../fixtures/deployment-entity.fixture'
import { HookParams } from '../../../../app/v2/operator/interfaces/params.interface'
import { ReconcileDeploymentUsecase } from '../../../../app/v2/operator/use-cases/reconcile-deployment.usecase'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { MooveService } from '../../../../app/v2/core/integrations/moove'
import { ExecutionRepository } from '../../../../app/v2/api/deployments/repository/execution.repository'
import { HttpService } from '@nestjs/common'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'

describe('Reconcile deployment usecase spec', () => {

  const butlerNamespace = 'butler-namespace'
  const consoleLoggerService = new ConsoleLoggerService()
  const envConfiguration = { butlerNamespace: butlerNamespace } as IEnvConfiguration

  const deploymentRepository = new DeploymentRepositoryV2()
  const componentsRepository = new ComponentsRepositoryV2()
  const executionRepository = new ExecutionRepository(consoleLoggerService)
  const mooveService = new MooveService(new HttpService(), consoleLoggerService)

  const k8sClient = new K8sClient(consoleLoggerService, envConfiguration)

  let hookParamsWithNothingCreated: HookParams
  let hookParamsWithDeploymentNotReady: HookParams

  beforeEach(() => {
    hookParamsWithNothingCreated = {
      'controller': {
        'kind': 'CompositeController',
        'apiVersion': 'metacontroller.k8s.io/v1alpha1',
        'metadata': {
          'name': 'charlesdeployments-controller',
          'uid': '67a4c2e9-4a27-4c8c-8c99-735c96ead809',
          'resourceVersion': '834',
          'generation': 1,
          'creationTimestamp': '2021-01-18T13:29:13Z',
          'labels': {
            'app.kubernetes.io/managed-by': 'Helm'
          },
          'annotations': {
            'meta.helm.sh/release-name': 'charlescd',
            'meta.helm.sh/release-namespace': 'default'
          }
        },
        'spec': {
          'parentResource': {
            'apiVersion': 'charlescd.io/v1',
            'resource': 'charlesdeployments'
          },
          'childResources': [
            {
              'apiVersion': 'v1',
              'resource': 'services',
              'updateStrategy': {
                'method': 'Recreate',
                'statusChecks': {}
              }
            },
            {
              'apiVersion': 'apps/v1',
              'resource': 'deployments',
              'updateStrategy': {
                'method': 'Recreate',
                'statusChecks': {}
              }
            }
          ],
          'hooks': {
            'sync': {
              'webhook': {
                'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/reconcile'
              }
            },
            'finalize': {
              'webhook': {
                'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/finalize'
              }
            }
          },
          'generateSelector': true
        },
        'status': {}
      },
      'parent': {
        'apiVersion': 'charlescd.io/v1',
        'kind': 'CharlesDeployment',
        'metadata': {
          'creationTimestamp': '2021-01-18T13:33:14Z',
          'finalizers': [
            'metacontroller.app/compositecontroller-charlesdeployments-controller'
          ],
          'generation': 1,
          'labels': {
            // this key is used to fetch the deployment
            'deployment_id': 'b7d08a07-f29d-452e-a667-7a39820f3262'
          },
          'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'namespace': 'default',
          'resourceVersion': '1368',
          'uid': 'aeb60d21-75d8-40d5-8639-9c5623c35921'
        },
        'spec': {
          'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'components': [
            {
              'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
              'name': 'batata',
              'tag': 'latest'
            },
            {
              'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
              'name': 'jilo',
              'tag': 'latest'
            }
          ],
          'deploymentId': 'b1e16c7d-15dd-4e4d-8d4b-d8c73ddf847c'
        }
      },
      'children': {
        'Deployment.apps/v1': {},
        'Service.v1': {}
      },
      'finalizing': false
    }
    hookParamsWithDeploymentNotReady = {
      'controller': {
        'kind': 'CompositeController',
        'apiVersion': 'metacontroller.k8s.io/v1alpha1',
        'metadata': {
          'name': 'charlesdeployments-controller',
          'uid': '67a4c2e9-4a27-4c8c-8c99-735c96ead809',
          'resourceVersion': '834',
          'generation': 1,
          'creationTimestamp': '2021-01-18T13:29:13Z',
          'labels': {
            'app.kubernetes.io/managed-by': 'Helm'
          },
          'annotations': {
            'meta.helm.sh/release-name': 'charlescd',
            'meta.helm.sh/release-namespace': 'default'
          }
        },
        'spec': {
          'parentResource': {
            'apiVersion': 'charlescd.io/v1',
            'resource': 'charlesdeployments'
          },
          'childResources': [
            {
              'apiVersion': 'v1',
              'resource': 'services',
              'updateStrategy': {
                'method': 'Recreate',
                'statusChecks': {}
              }
            },
            {
              'apiVersion': 'apps/v1',
              'resource': 'deployments',
              'updateStrategy': {
                'method': 'Recreate',
                'statusChecks': {}
              }
            }
          ],
          'hooks': {
            'sync': {
              'webhook': {
                'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/reconcile'
              }
            },
            'finalize': {
              'webhook': {
                'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/finalize'
              }
            }
          },
          'generateSelector': true
        },
        'status': {}
      },
      'parent': {
        'apiVersion': 'charlescd.io/v1',
        'kind': 'CharlesDeployment',
        'metadata': {
          'creationTimestamp': '2021-01-18T13:33:14Z',
          'finalizers': [
            'metacontroller.app/compositecontroller-charlesdeployments-controller'
          ],
          'generation': 1,
          'labels': {
            // this key is used to fetch the deployment
            'deployment_id': 'b7d08a07-f29d-452e-a667-7a39820f3262'
          },
          'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'namespace': 'default',
          'resourceVersion': '1368',
          'uid': 'aeb60d21-75d8-40d5-8639-9c5623c35921'
        },
        'spec': {
          'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'components': [
            {
              'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
              'name': 'batata',
              'tag': 'latest'
            },
            {
              'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
              'name': 'jilo',
              'tag': 'latest'
            }
          ],
          'deploymentId': 'b1e16c7d-15dd-4e4d-8d4b-d8c73ddf847c'
        }
      },
      'children': {
        'Deployment.apps/v1': {
          'hello-kubernetes-build-image-tag-b46fd548-0082-4021-ba80-a50703c44a3b': {
            'apiVersion': 'apps/v1',
            'kind': 'Deployment',
            'metadata': {
              'creationTimestamp': '2021-01-15T21:01:22Z',
              'generation': 1,
              'labels': {
                'app': 'hello-kubernetes',
                'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
                'controller-uid': '5c6e0a99-f05b-4198-8499-469fa34f755b',
                // this key is used to match the deployment
                'tag': 'v1',
                'version': 'hello-kubernetes'
              },
              'name': 'batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              'namespace': 'default',
              'ownerReferences': [
                {
                  'apiVersion': 'charlescd.io/v1',
                  'blockOwnerDeletion': true,
                  'controller': true,
                  'kind': 'CharlesDeployment',
                  'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
                  'uid': '5c6e0a99-f05b-4198-8499-469fa34f755b'
                }
              ],
              'resourceVersion': '6755',
              'uid': '1127f97a-4288-4dfc-8cc3-6c9a039b26cf'
            },
            'spec': {
              'progressDeadlineSeconds': 600,
              'replicas': 1,
              'revisionHistoryLimit': 10,
              'selector': {
                'matchLabels': {
                  'app': 'batata',
                  'version': 'batata'
                }
              },
              'strategy': {
                'rollingUpdate': {
                  'maxSurge': '25%',
                  'maxUnavailable': '25%'
                },
                'type': 'RollingUpdate'
              },
              'template': {
                'metadata': {
                  'annotations': {
                    'sidecar.istio.io/inject': 'true'
                  },
                  'creationTimestamp': null,
                  'labels': {
                    'app': 'batata',
                    'version': 'batata'
                  }
                },
                'spec': {
                  'containers': [
                    {
                      'args': [
                        '-text',
                        'hello'
                      ],
                      'image': 'hashicorp/http-echo',
                      'imagePullPolicy': 'Always',
                      'livenessProbe': {
                        'failureThreshold': 3,
                        'httpGet': {
                          'path': '/',
                          'port': 5678,
                          'scheme': 'HTTP'
                        },
                        'initialDelaySeconds': 30,
                        'periodSeconds': 20,
                        'successThreshold': 1,
                        'timeoutSeconds': 1
                      },
                      'name': 'batata',
                      'readinessProbe': {
                        'failureThreshold': 3,
                        'httpGet': {
                          'path': '/',
                          'port': 5678,
                          'scheme': 'HTTP'
                        },
                        'initialDelaySeconds': 30,
                        'periodSeconds': 20,
                        'successThreshold': 1,
                        'timeoutSeconds': 1
                      },
                      'resources': {
                        'limits': {
                          'cpu': '128m',
                          'memory': '128Mi'
                        },
                        'requests': {
                          'cpu': '64m',
                          'memory': '64Mi'
                        }
                      },
                      'terminationMessagePath': '/dev/termination-log',
                      'terminationMessagePolicy': 'File'
                    }
                  ],
                  'dnsPolicy': 'ClusterFirst',
                  'restartPolicy': 'Always',
                  'schedulerName': 'default-scheduler',
                  'securityContext': {},
                  'terminationGracePeriodSeconds': 30
                }
              }
            },
            'status': {
              'availableReplicas': 1,
              'conditions': [
                {
                  'lastTransitionTime': '2021-01-15T21:01:22Z',
                  'lastUpdateTime': '2021-01-15T21:02:06Z',
                  'message': 'ReplicaSet "batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60-7f7dfc545f" has successfully progressed.',
                  'reason': 'NewReplicaSetAvailable',
                  'status': 'True',
                  'type': 'Progressing'
                }
              ],
              'observedGeneration': 1,
              'readyReplicas': 1,
              'replicas': 1,
              'updatedReplicas': 1
            }
          },
        },
        'Service.v1': {}
      },
      'finalizing': false
    }
  })

  it('should generate the reconcile deployment object with the correct metadata changes', async() => {
    const currentDeployment = getDeploymentWithManifestFixture('simple')
    const componentsCircle1 = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'noManifest', 'namespace', true)
    ]

    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => currentDeployment)
    jest.spyOn(executionRepository, 'findOneOrFail').mockImplementation(async() =>
      new Execution(getDeploymentWithManifestFixture('simple'), ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    )
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => componentsCircle1)

    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${currentDeployment.components[0].imageTag}-${currentDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: currentDeployment.circleId,
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes',
                version: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'hello-kubernetes',
                  version: 'hello-kubernetes',
                  circleId: currentDeployment.circleId,
                  component: currentDeployment.components[0].name,
                  tag: currentDeployment.components[0].imageTag
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        }
      ],
      resyncAfterSeconds: 5
    }

    const reconcileDeploymentUsecase = new ReconcileDeploymentUsecase(
      k8sClient,
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
    )

    const reconcileObj = await reconcileDeploymentUsecase.execute(hookParamsWithNothingCreated)

    expect(reconcileObj).toEqual(expectedReconcileObj)
  })

  it('should generate the correct desired state with different deployment manifests when a override happens', async() => {
    const currentDeployment = getDeploymentWithManifestAndPreviousFixture('simple')
    const previousDeployment = getDeploymentWithManifestFixture('simple')
    jest.spyOn(deploymentRepository, 'findOneOrFail')
      .mockImplementationOnce(async() => getDeploymentWithManifestAndPreviousFixture('simple'))


    jest.spyOn(executionRepository, 'findOneOrFail').mockImplementation(async() =>
      new Execution(getDeploymentWithManifestAndPreviousFixture('simple'), ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    )

    // this won't change the test outcome
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => [])

    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${previousDeployment.components[0].imageTag}-${previousDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: previousDeployment.circleId,
              component: previousDeployment.components[0].name,
              tag: previousDeployment.components[0].imageTag
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes',
                version: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'hello-kubernetes',
                  version: 'hello-kubernetes',
                  circleId: previousDeployment.circleId,
                  component: previousDeployment.components[0].name,
                  tag: previousDeployment.components[0].imageTag
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        },
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${currentDeployment.components[0].imageTag}-${currentDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: currentDeployment.circleId,
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes',
                version: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'hello-kubernetes',
                  version: 'hello-kubernetes',
                  circleId: currentDeployment.circleId,
                  component: currentDeployment.components[0].name,
                  tag: currentDeployment.components[0].imageTag

                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url-2.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        }
      ],
      resyncAfterSeconds: 5
    }

    const reconcileDeploymentUsecase = new ReconcileDeploymentUsecase(
      k8sClient,
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
    )

    const reconcileObj = await reconcileDeploymentUsecase.execute(hookParamsWithDeploymentNotReady)

    expect(reconcileObj).toEqual(expectedReconcileObj)
  })

  it('should generate the correct desired state without manifest repetition when a override happens', async() => {
    const currentDeployment = getDeploymentWithManifestAndPreviousFixture('complex')
    const previousDeployment = getDeploymentWithManifestFixture('complex')
    jest.spyOn(deploymentRepository, 'findOneOrFail')
      .mockImplementationOnce(async() => getDeploymentWithManifestAndPreviousFixture('complex'))
      .mockImplementationOnce(async() => getDeploymentWithManifestFixture('complex'))

    jest.spyOn(executionRepository, 'findOneOrFail').mockImplementation(async() =>
      new Execution(getDeploymentWithManifestAndPreviousFixture('complex'), ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    )

    // this won't change the test outcome
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => [])

    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${previousDeployment.components[0].imageTag}-${previousDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: previousDeployment.circleId,
              component: previousDeployment.components[0].name,
              tag: previousDeployment.components[0].imageTag
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes',
                version: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'hello-kubernetes',
                  version: 'hello-kubernetes',
                  circleId: previousDeployment.circleId,
                  component: previousDeployment.components[0].name,
                  tag: previousDeployment.components[0].imageTag
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        },
        {
          apiVersion: 'v1',
          data: {
            'secret-data': 'dGVzdA=='
          },
          kind: 'Secret',
          metadata: {
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: previousDeployment.circleId,
              component: previousDeployment.components[0].name,
              tag: previousDeployment.components[0].imageTag
            },
            name: 'custom-secret',
            namespace: 'namespace'
          },
          type: 'Opaque'
        },
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${currentDeployment.components[0].imageTag}-${currentDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: currentDeployment.circleId,
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes',
                version: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'hello-kubernetes',
                  version: 'hello-kubernetes',
                  circleId: currentDeployment.circleId,
                  component: currentDeployment.components[0].name,
                  tag: currentDeployment.components[0].imageTag
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url-2.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        }
      ],
      resyncAfterSeconds: 5
    }

    const reconcileDeploymentUsecase = new ReconcileDeploymentUsecase(
      k8sClient,
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
    )

    const reconcileObj = await reconcileDeploymentUsecase.execute(hookParamsWithDeploymentNotReady)

    expect(reconcileObj).toEqual(expectedReconcileObj)
  })

  it('should return the desired manifests of the new deployment when there is no previous and it is not ready yet', async() => {
    const currentDeployment = getDeploymentWithManifestFixture('complex')
    jest.spyOn(deploymentRepository, 'findOneOrFail')
      .mockImplementation(async() => getDeploymentWithManifestFixture('complex'))

    jest.spyOn(executionRepository, 'findOneOrFail').mockImplementation(async() =>
      new Execution(getDeploymentWithManifestAndPreviousFixture('complex'), ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    )

    // this won't change the test outcome
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => [])

    const reconcileDeploymentUsecase = new ReconcileDeploymentUsecase(
      k8sClient,
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
    )

    const reconcileObj = await reconcileDeploymentUsecase.execute(hookParamsWithDeploymentNotReady)

    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${currentDeployment.components[0].imageTag}-${currentDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: currentDeployment.circleId,
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes',
                version: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'hello-kubernetes',
                  version: 'hello-kubernetes',
                  circleId: currentDeployment.circleId,
                  component: currentDeployment.components[0].name,
                  tag: currentDeployment.components[0].imageTag
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        },
        {
          apiVersion: 'v1',
          data: {
            'secret-data': 'dGVzdA=='
          },
          kind: 'Secret',
          metadata: {
            labels: {
              app: 'hello-kubernetes',
              circleId: currentDeployment.circleId,
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag,
              version: 'hello-kubernetes'
            },
            name: 'custom-secret',
            namespace: 'namespace'
          },
          type: 'Opaque'
        },
      ],
      resyncAfterSeconds: 5
    }
    expect(reconcileObj).toEqual(expectedReconcileObj)
  })

  it('should create the correct metadata labels/namespace fields when the manifests dont have it', async() => {
    const componentsCircle1 = [
      createDeployComponent('A', 'v1', 'circle-1', true, 'noManifest', 'namespace', true)
    ]
    const currentDeployment = getDeploymentWithManifestFixture('noLabels')

    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => currentDeployment)
    jest.spyOn(executionRepository, 'findOneOrFail').mockImplementation(async() =>
      new Execution(getDeploymentWithManifestFixture('noLabels'), ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    )
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => componentsCircle1)

    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: `hello-kubernetes-${currentDeployment.components[0].imageTag}-${currentDeployment.circleId}`,
            namespace: 'namespace',
            labels: {
              circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag,
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
                  component: currentDeployment.components[0].name,
                  tag: currentDeployment.components[0].imageTag,
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url.com',
                    livenessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    readinessProbe: {
                      failureThreshold: 3,
                      httpGet: {
                        path: '/',
                        port: 80,
                        scheme: 'HTTP'
                      },
                      initialDelaySeconds: 30,
                      periodSeconds: 20,
                      successThreshold: 1,
                      timeoutSeconds: 1
                    },
                    imagePullPolicy: 'Always',
                    resources: {
                      limits: {
                        cpu: '128m',
                        memory: '128Mi'
                      },
                      requests: {
                        cpu: '64m',
                        memory: '64Mi'
                      }
                    }
                  }
                ],
                imagePullSecrets: [
                  {
                    name: 'realwavelab-registry'
                  }
                ]
              }
            }
          }
        },
        {
          apiVersion: 'apps/v1',
          kind: 'StatefulSet',
          metadata: {
            name: 'hello-kubernetes',
            namespace: 'namespace',
            labels: {
              circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
              component: currentDeployment.components[0].name,
              tag: currentDeployment.components[0].imageTag,
            }
          },
          spec: {
            serviceName: 'helm-test-chart',
            replicas: 2,
            selector: {
              matchLabels: {
                app: 'hello-kubernetes'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
                  component: currentDeployment.components[0].name,
                  tag: currentDeployment.components[0].imageTag
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-url.com',
                    ports: [
                      {
                        containerPort: 80,
                        name: 'web'
                      }
                    ],
                    volumeMounts: [
                      {
                        name: 'www',
                        mountPath: '/usr/share/helm-test/html'
                      }
                    ]
                  }
                ]
              }
            },
            volumeClaimTemplates: [
              {
                metadata: {
                  name: 'www'
                },
                spec: {
                  accessModes: [
                    'ReadWriteOnce'
                  ],
                  resources: {
                    requests: {
                      storage: '1Gi'
                    }
                  }
                }
              }
            ]
          }
        }
      ],
      resyncAfterSeconds: 5
    }

    const reconcileDeploymentUsecase = new ReconcileDeploymentUsecase(
      k8sClient,
      deploymentRepository,
      componentsRepository,
      consoleLoggerService,
    )

    const reconcileObj = await reconcileDeploymentUsecase.execute(hookParamsWithNothingCreated)

    expect(reconcileObj).toEqual(expectedReconcileObj)
  })
})
