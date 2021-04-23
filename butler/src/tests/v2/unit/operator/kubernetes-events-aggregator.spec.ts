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
import * as http from 'http'

import { EventsLogsAggregator } from '../../../../app/v2/operator/logs-aggregator/kubernetes-events-aggregator'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { CoreV1Event, KubernetesObject } from '@kubernetes/client-node'
import { LogRepository } from '../../../../app/v2/api/deployments/repository/log.repository'
import { LogEntity } from '../../../../app/v2/api/deployments/entity/logs.entity'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

describe('Aggregate events from kubernetes to charles logs', () => {

  const butlerNamespace = 'butler-namespace'
  const logService = new ConsoleLoggerService()
  const k8sClient = new K8sClient(logService, { butlerNamespace: butlerNamespace } as IEnvConfiguration)
  const logRepository = new LogRepository()

  it('Not process event without valid involved object', async () => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(spec => Promise.resolve({} as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(entity => Promise.resolve({} as LogEntity))

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService)
    await eventsLogsAggregator.processEvent({} as CoreV1Event)

    expect(readSpy).toBeCalledTimes(0)
    expect(logRepositorySpy).toBeCalledTimes(0)
  })

  it('Save event as a log when the resource has the label deploymentId', async () => {
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(spec => Promise.resolve({
        body: {
          metadata: {
            labels: {
              deploymentId: 'a3e9c42b-8ff4-48a7-9a4e-e81f1d5dc3fa'
            }
          }
        },
        response: {} as http.IncomingMessage
      } as K8sClientResolveObject))

    const logRepositorySpy = jest.spyOn(logRepository, 'save')
      .mockImplementation(entity => Promise.resolve({} as LogEntity))

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
      message: 'Created container guestbook',
      type: 'Normal',
    }

    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService)
    await eventsLogsAggregator.processEvent(coreEvent as CoreV1Event)

    expect(readSpy).toBeCalledTimes(1)
    expect(logRepositorySpy).toBeCalledTimes(1)
  })
})