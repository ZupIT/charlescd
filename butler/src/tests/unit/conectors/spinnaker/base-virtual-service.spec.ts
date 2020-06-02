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
import {
  createEmptyVirtualService,
  createVirtualService
} from '../../../../app/core/integrations/cd/spinnaker/connector/utils/manifests/base-virtual-service'
import expectedBaseVirtualService from './fixtures/expected-base-virtual-service'
import expectedEmptyVirtualService from './fixtures/expected-empty-virtual-service'

it('creates the virtual service when there is no header on the circle', () => {
  const appName = 'app-name'
  const appNamespace = 'app-namespace'
  const circles = [{ destination: { version: 'v3' }, header: { headerValue: 'header-value', headerName: 'header-name' } }]
  const hosts = undefined
  const virtualService = createVirtualService(appName, appNamespace, circles, hosts)

  expect(virtualService).toEqual(expectedBaseVirtualService)
})

it('creates empty virtual service when there is no versions', () => {
  const appName = 'app-name'
  const appNamespace = 'app-namespace'
  const virtualService = createEmptyVirtualService(appName, appNamespace)

  expect(virtualService).toEqual(expectedEmptyVirtualService)

})
