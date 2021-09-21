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

import 'jest'
import * as http from 'http'

import { EventsLogsAggregator } from '../../../../app/v2/operator/logs-aggregator/kubernetes-events-aggregator'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { CoreV1Event, KubernetesObject } from '@kubernetes/client-node'
import { LogRepository } from '../../../../app/v2/api/deployments/repository/log.repository'
import { LogEntity } from '../../../../app/v2/api/deployments/entity/logs.entity'
import * as moment from 'moment'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

describe('Aggregate events from kubernetes to charles logs', () => {

  let k8sClient: K8sClient
  let logRepository: LogRepository
  let deploymentsRepository: DeploymentRepositoryV2

  const butlerNamespace = 'butler-namespace'
  const logService = new ConsoleLoggerService()
  const deploymentId = 'a3e9c42b-8ff4-48a7-9a4e-e81f1d5dc3fa'

  beforeEach(() => {
    k8sClient = new K8sClient(logService, { butlerNamespace: butlerNamespace } as IEnvConfiguration)
    logRepository = new LogRepository()
    deploymentsRepository = new DeploymentRepositoryV2()
  })

  it('Do not aggregate event without valid involved object', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({} as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate({
      involvedObject: {}
    } as CoreV1Event)

    expect(readSpy).toBeCalledTimes(0)
    expect(logRepositorySpy).toBeCalledTimes(0)
  })

  it('Aggregate event as a log when the resource has the deploymentId label', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          metadata: {
            labels: {
              deploymentId: deploymentId
            }
          }
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    jest.spyOn(logRepository, 'findDeploymentLogs').mockImplementation(
      async() => Promise.resolve(undefined)
    )

    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-04-23T11:30:20Z')
      },
      involvedObject: {
        namespace: 'events',
        kind: 'Pod',
        apiVersion: 'v1',
        name: 'pod-name'
      },
      reason: 'Created',
      message: 'Created container pod-name',
      type: 'Normal',
    }

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event)

    expect(readSpy).toBeCalledTimes(1)

    const expectedLogEntity = {
      deploymentId: deploymentId,
      logs: [
        {
          type: 'INFO',
          title: 'Created',
          timestamp: '2021-04-23T08:30:20-03:00',
          details: JSON.stringify({
            message: 'Created container pod-name',
            object: 'Pod/pod-name'
          })
        }
      ]
    }

    expect(logRepositorySpy).toHaveBeenCalledWith(expectedLogEntity)
  })

  it('Do not aggregate event when the resource does not have the deploymentId label', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          metadata: {
            labels: {}
          }
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-04-23T11:30:20Z')
      },
      involvedObject: {
        namespace: 'events',
        kind: 'Pod',
        apiVersion: 'v1',
        name: 'pod-name'
      },
      reason: 'Created',
      message: 'Created container pod-name',
      type: 'Normal',
    }

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event)

    expect(readSpy).toBeCalledTimes(1)
    expect(logRepositorySpy).toBeCalledTimes(0)
  })

  it('Do not aggregate events old then the given date', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          metadata: {
            labels: {
              deploymentId: deploymentId
            }
          }
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-04-23T11:30:20Z')
      },
      involvedObject: {
        namespace: 'events',
        kind: 'Pod',
        apiVersion: 'v1',
        name: 'pod-name'
      },
      reason: 'Created',
      message: 'Created container pod-name',
      type: 'Normal',
    }

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    const since = new Date('2021-04-23T11:35:20Z')
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event, since)

    expect(readSpy).toBeCalledTimes(0)
    expect(logRepositorySpy).toBeCalledTimes(0)
  })

  it('Should cache resource read from kubernetes', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          metadata: {
            labels: {
              deploymentId: deploymentId
            }
          }
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    jest.spyOn(logRepository, 'findDeploymentLogs').mockImplementation(
      async() => Promise.resolve(undefined)
    )

    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-04-23T11:30:20Z')
      },
      involvedObject: {
        namespace: 'events',
        kind: 'Pod',
        apiVersion: 'v1',
        name: 'pod-name'
      },
      reason: 'Created',
      message: 'Created container pod-name',
      type: 'Normal',
    }

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event) // First call
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event) // Second call

    expect(readSpy).toBeCalledTimes(1)
    expect(logRepositorySpy).toBeCalledTimes(2)
  })

  it('Should not aggregate events from kubernetes system namespaces', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          metadata: {
            labels: {
              deploymentId: deploymentId
            }
          }
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-04-23T11:30:20Z')
      },
      involvedObject: {
        namespace: 'kube-system',
        kind: 'Pod',
        apiVersion: 'v1',
        name: 'kube-scheduler'
      },
      reason: 'Created',
      message: 'Created container kube-scheduler',
      type: 'Normal',
    }

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event)

    expect(readSpy).toBeCalledTimes(0)
    expect(logRepositorySpy).toBeCalledTimes(0)
  })

  it('Should not save logs or cache a event for a resource when fails to read them', async() => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.reject({
        body: {
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(() => Promise.resolve({} as LogEntity))

    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-04-23T11:30:20Z')
      },
      involvedObject: {
        namespace: 'events',
        kind: 'Pod',
        apiVersion: 'v1',
        name: 'pod-name'
      },
      reason: 'Created',
      message: 'Created container pod-name',
      type: 'Normal',
    }



    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event)
    await eventsLogsAggregator.aggregate(coreEvent as CoreV1Event)

    expect(readSpy).toBeCalledTimes(2)
    expect(logRepositorySpy).toBeCalledTimes(0)
  })

  it('should not save duplicated metacontroller logs', async() => {

    const body = {
      apiVersion: 'charlescd.io/v1',
      kind: 'CharlesDeployment',
      name: 'circle',
      spec: {
        'deploymentId': '6d1e1881-72d3-4fb5-84da-8bd61bb8e2d3'
      }
    }

    jest.spyOn(k8sClient, 'readResource').mockImplementation(
      async() => Promise.resolve({ body: body, response: {} as http.IncomingMessage })
    )

    const timestamp = new Date()
    const eventMessage =
        `Sync error: invalid labels on desired child Deployment charles/null-release-darwin-test-schu-v-1
          -952e581c-54a8-4fda-8669-05be755cc697: .metadata.labels accessor error: contains non-string key in the map`
    const corev1Event = new CoreV1Event()
    corev1Event.involvedObject = {
      apiVersion: 'charlescd.io/v1',
      kind: 'CharlesDeployment',
      name: 'circle'
    }
    corev1Event.metadata = {
      creationTimestamp : timestamp
    }
    corev1Event.message = eventMessage
    corev1Event.reason = 'SyncError'



    const log = {
      type: 'WARN',
      title: 'SyncError',
      details: JSON.stringify({
        message: eventMessage,
        object: `${corev1Event.involvedObject.kind}/${corev1Event.involvedObject.name}`
      }),
      timestamp: moment(timestamp).format()
    }
    const logEntity = new LogEntity('6d1e1881-72d3-4fb5-84da-8bd61bb8e2d3', [log])


    jest.spyOn(logRepository, 'findDeploymentLogs').mockImplementation(
      async() => Promise.resolve(logEntity)
    )

    const spySaveLogs = jest.spyOn(logRepository, 'save')

    const logAgreggator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await logAgreggator.aggregate(corev1Event, timestamp)
    expect(spySaveLogs).not.toBeCalled()
  })
})