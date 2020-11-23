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

import { formatDnsLabel } from '../../../../app/v1/core/integrations/cd/spinnaker/connector/utils/helpers/format-dns-label'

it('does not modify version if it matches the dns regex', () => {
  const version = 'v1-2'
  expect(formatDnsLabel(version)).toEqual('v1-2')
})

it('replaces only characters that dont match the regex', () => {
  const version = 'v1.2-3'
  expect(formatDnsLabel(version)).toEqual('v1-2-3')
})

it('replaces complex characters that dont match', () => {
  const version = '1 2 3 @ 379.2.1.2.3'
  expect(formatDnsLabel(version)).toEqual('1-2-3-379-2-1-2-3')
})
