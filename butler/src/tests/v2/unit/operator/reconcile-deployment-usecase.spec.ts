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
import { componentsFixtureCircle1, deploymentWithManifestFixture } from '../../fixtures/deployment-entity.fixture'
import { HookParams } from '../../../../app/v2/operator/interfaces/params.interface'
import { ReconcileDeploymentUsecase } from '../../../../app/v2/operator/use-cases/reconcile-deployment.usecase'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { MooveService } from '../../../../app/v2/core/integrations/moove'
import { ExecutionRepository } from '../../../../app/v2/api/deployments/repository/execution.repository'
import { HttpService } from '@nestjs/common'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums/execution-type.enum'
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

  let hookParams: HookParams

  beforeEach(() => {
    jest.spyOn(deploymentRepository, 'findOneOrFail').mockImplementation(async() => deploymentWithManifestFixture)
    jest.spyOn(executionRepository, 'findOneOrFail').mockImplementation(async() =>
      new Execution(deploymentWithManifestFixture, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    )
    jest.spyOn(componentsRepository, 'findActiveComponents').mockImplementation(async() => componentsFixtureCircle1)

    hookParams = {
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
            'deployment_id': 'b1e16c7d-15dd-4e4d-8d4b-d8c73ddf847c'
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
  })

  it('should generate the reconcile deployment object with the correct metadata changes', async() => {
    const expectedReconcileObj = {
      children: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: 'hello-kubernetes-build-image-tag-b46fd548-0082-4021-ba80-a50703c44a3b',
            namespace: 'namespace',
            labels: {
              app: 'hello-kubernetes',
              version: 'hello-kubernetes',
              circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
              deploymentId: 'b7d08a07-f29d-452e-a667-7a39820f3262',
              component: 'hello-kubernetes',
              tag: 'tag-example'
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
                  version: 'hello-kubernetes'
                }
              },
              spec: {
                containers: [
                  {
                    name: 'hello-kubernetes',
                    image: 'build-image-tag',
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
      executionRepository,
      mooveService
    )

    const reconcileObj = await reconcileDeploymentUsecase.execute(hookParams)

    expect(reconcileObj).toEqual(expectedReconcileObj)
  })

  // TODO reconcile override with different tag but same component name (check if the desired state is concatenated
  // correctly

  // TODO create these legacy reconcile utils tests inside here
  // it('returns empty array for the first reconcile loop on same circle that already had deployments', () => {
  //   const params = reconcileFixturesParams.paramsWithPreviousDeployment
  //   const currentDeployment = reconcileFixtures.currentDeploymentId
  //   expect(ReconcileUtils.specsByDeployment(params, currentDeployment)).toEqual([])
  // })
  //
  // it('returns list of previous deployment specs', () => {
  //   const params = reconcileFixturesParams.paramsWithPreviousDeployment
  //   const previousDeployment = reconcileFixtures.previousDeploymentId
  //   const ids = ReconcileUtils.specsByDeployment(params, previousDeployment).map(s => s.metadata.labels.deploymentId)
  //   expect(ids).toEqual([previousDeployment, previousDeployment])
  // })
  //
  // it('returns false if current deployments specs are not ready but previous deployments are still running', () => {
  //   const params = reconcileFixturesParams.paramsWithPreviousDeployment
  //   const previousDeployment = reconcileFixtures.previousDeploymentId
  //   const currentDeployment = reconcileFixtures.currentDeploymentId
  //   const currentSpecs = ReconcileUtils.specsByDeployment(params, currentDeployment)
  //   const previousSpecs = ReconcileUtils.specsByDeployment(params, previousDeployment)
  //   expect(ReconcileUtils.checkConditions(currentSpecs)).toEqual(false)
  //   expect(ReconcileUtils.checkConditions(previousSpecs)).toEqual(true)
  // })
  //
  // it('concatenates deployments and services from previous and current deployment', () => {
  //   const previousComponents = [
  //     new ComponentEntityV2(
  //       UrlConstants.helmRepository,
  //       'v1',
  //       'https://repository.com/B:v1',
  //       'B',
  //       '1c29210c-e313-4447-80e3-db89b2359138',
  //       null,
  //       null,
  //       [
  //         {
  //           kind: 'Deployment',
  //           metadata: {
  //             name: 'previous'
  //           }
  //         },
  //         {
  //           kind: 'Service',
  //           metadata: {
  //             name: 'previous'
  //           }
  //         },
  //         {
  //           kind: 'Deployment',
  //           metadata: {
  //             name: 'current-2'
  //           }
  //         },
  //         {
  //           kind: 'Service',
  //           metadata: {
  //             name: 'current-2'
  //           }
  //         }
  //       ]
  //     )
  //   ]
  //   const previousDeployment = new DeploymentEntityV2(
  //     reconcileFixtures.previousDeploymentId,
  //     'some-author',
  //     'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
  //     'some-url',
  //     previousComponents,
  //     false,
  //     'my-namespace',
  //     5
  //   )
  //
  //   const currentComponents = [
  //     {
  //       kind: 'Deployment',
  //       metadata: {
  //         name: 'current-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Service',
  //       metadata: {
  //         name: 'current',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Deployment',
  //       metadata: {
  //         name: 'current-2-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Service',
  //       metadata: {
  //         name: 'current-2',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     }
  //   ]
  //   const concat = ReconcileUtils.concatWithPrevious(previousDeployment, currentComponents)
  //   const expected = [
  //     {
  //       kind: 'Deployment',
  //       metadata: {
  //         name: 'current-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Service',
  //       metadata: {
  //         name: 'current',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Deployment',
  //       metadata: {
  //         name: 'current-2-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Service',
  //       metadata: {
  //         name: 'current-2',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.currentDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Deployment',
  //       metadata: {
  //         name: 'previous-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.previousDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     },
  //     {
  //       kind: 'Service',
  //       metadata: {
  //         name: 'previous',
  //         namespace: 'my-namespace',
  //         labels: {
  //           'deploymentId': reconcileFixtures.previousDeploymentId,
  //           'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
  //         }
  //       }
  //     }
  //   ]
  //   expect(concat).toEqual(expected)
  // })
  //
  //
  // it('should replace the deployment name with a concatenation of Release.Name, tag and circleId', () => {
  //   const component = new ComponentEntityV2(
  //     UrlConstants.helmRepository,
  //     'v1',
  //     'build-image-url.com',
  //     'jilo',
  //     'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
  //     null,
  //     null,
  //     [...componentRawSpecs],
  //     false
  //   )
  //   const deployment = new DeploymentEntityV2(
  //     'b7d08a07-f29d-452e-a667-7a39820f3262',
  //     'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  //     'custom-circle-id',
  //     UrlConstants.deploymentCallbackUrl,
  //     [
  //       component
  //     ],
  //     false,
  //     'custom-namespace',
  //     60
  //   )
  //
  //   const preparedManifests = ReconcileUtils.addMetadata(deployment)
  //
  //   const expectedLabels = {
  //     app: 'jilo',
  //     version: 'jilo',
  //     deploymentId: deployment.id,
  //     circleId: deployment.circleId
  //   }
  //
  //   expect(preparedManifests).toHaveLength(2)
  //   expect(preparedManifests[0].metadata?.labels).toBe(expectedLabels)
  //   expect(preparedManifests[0].metadata?.name).toBe('jilo-v1-custom-circle-id')
  //   expect(preparedManifests[0].metadata?.namespace).toBe('custom-namespace')
  //   expect(preparedManifests[1].metadata?.labels).toBe(expectedLabels)
  //   expect(preparedManifests[1].metadata?.name).toBe('jilo')
  //   expect(preparedManifests[1].metadata?.namespace).toBe('custom-namespace')
  // })
})
