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

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

describe('Aggregate events from kubernetes to charles logs', () => {

  const butlerNamespace = 'butler-namespace'

  it('Not process event without valid involved object', async() => {
    const logService = new ConsoleLoggerService()
    const k8sClient = new K8sClient(logService, { butlerNamespace: butlerNamespace } as IEnvConfiguration)
    const readSpy = jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(spec => Promise.resolve({} as K8sClientResolveObject))

    const eventsLogsAggregator = new EventsLogsAggregator(logService, k8sClient)
    await eventsLogsAggregator.processEvent({} as CoreV1Event)

    expect(readSpy).toBeCalledTimes(0)
  })
})