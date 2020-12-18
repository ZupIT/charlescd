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

import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import * as http from 'http'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

describe('Undeployment CRD client apply method', () => {

  let k8sClient: K8sClient

  beforeEach(async() => {
    k8sClient = new K8sClient(new ConsoleLoggerService())
  })

  it('should call the read method with the correct arguments', async() => {

  })
})