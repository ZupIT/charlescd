/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../app/app.module'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { EntityManager } from 'typeorm'
import { HookParams } from '../../../../app/v2/operator/interfaces/params.interface'
import * as request from 'supertest'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { UrlConstants } from '../test-constants'
import { getSimpleManifests } from '../../fixtures/manifests.fixture'

describe('Reconcile deployments usecase', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let manager: EntityManager

  let hookParamsWithDeploymentNotReady: HookParams

  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService,
        DeploymentRepositoryV2
      ]
    })

    app = await TestSetupUtils.createApplication(module)
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    manager = fixtureUtilsService.manager

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
          'deploymentId': 'b7d08a07-f29d-452e-a667-7a39820f3262'
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
                'deploymentId': 'e728a072-b0aa-4459-88ba-0f4a9b71ae54',
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

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('should generate the reconcile deployment object with the correct metadata changes', async() => {
    const previousDeployment: DeploymentEntity = new DeploymentEntity(
      '29f3a5ee-73f5-4957-b2e9-47d3b493a484',
      'user-1',
      'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v1',
          'https://repository.com/A:v1',
          'A',
          '5209259f-3b1f-4fa4-b32c-e80eb33e819e',
          null,
          null,
          getSimpleManifests('A', 'my-namespace', 'imageurl.com')
        )
      ],
      false,
      'my-namespace',
      60
    )
    previousDeployment.current = false
    previousDeployment.healthy = false

    const currentDeployment: DeploymentEntity = new DeploymentEntity(
      'b7d08a07-f29d-452e-a667-7a39820f3262',
      'user-1',
      'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          UrlConstants.helmRepository,
          'v1',
          'https://repository.com/A:v1',
          'A',
          '222cd8db-3767-45d5-a415-7cca09cccf91',
          null,
          null,
          getSimpleManifests('A', 'my-namespace', 'imageurl.com')
        )
      ],
      false,
      'my-namespace',
      60
    )
    currentDeployment.current = true
    currentDeployment.healthy = false
    currentDeployment.previousDeploymentId = previousDeployment.id

    await manager.save(previousDeployment)
    await manager.save(currentDeployment)

    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            labels: {
              app: 'A',
              circleId: 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              component: 'A',
              deploymentId: '29f3a5ee-73f5-4957-b2e9-47d3b493a484',
              tag: 'tag-example',
              version: 'A'
            },
            name: 'A-v1-29f3a5ee-73f5-4957-b2e9-47d3b493a484',
            namespace: 'my-namespace'
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'A',
                version: 'A'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'A',
                  circleId: 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
                  deploymentId: '29f3a5ee-73f5-4957-b2e9-47d3b493a484',
                  version: 'A'
                }
              },
              spec: {
                containers: [
                  {
                    image: 'imageurl.com',
                    imagePullPolicy: 'Always',
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
                    name: 'A',
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
            labels: {
              app: 'A',
              circleId: 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              component: 'A',
              deploymentId: 'b7d08a07-f29d-452e-a667-7a39820f3262',
              tag: 'tag-example',
              version: 'A'
            },
            name: 'A-v1-b7d08a07-f29d-452e-a667-7a39820f3262',
            namespace: 'my-namespace'
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: 'A',
                version: 'A'
              }
            },
            template: {
              metadata: {
                annotations: {
                  'sidecar.istio.io/inject': 'true'
                },
                labels: {
                  app: 'A',
                  circleId: 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
                  deploymentId: 'b7d08a07-f29d-452e-a667-7a39820f3262',
                  version: 'A'
                }
              },
              spec: {
                containers: [
                  {
                    image: 'imageurl.com',
                    imagePullPolicy: 'Always',
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
                    name: 'A',
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

    await request(app.getHttpServer())
      .post('/v2/operator/deployment/hook/reconcile')
      .send(hookParamsWithDeploymentNotReady)
      .expect(200, expectedReconcileObj)
  })
})
