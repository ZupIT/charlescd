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
import baseStageHelm from '../../../../app/v1/core/integrations/cd/spinnaker/connector/utils/base-stage-helm'
import expectedBaseStageHelm from './fixtures/expected-base-stage-helm'
import expectedBaseHelmPreviousStages from './fixtures/expected-base-helm-previous-stages'

it('builds the helm stage without previous stage', () => {
  expect(
    baseStageHelm({ appNamespace: 'app-namespace', appName: 'app-name' },
      'github-config', 'version', 'version.url', 'ref-if', ['req-ref-id'], undefined,
      '0e19100a-448d-4aa4-8fa0-7cf84e91ae10')
  ).toEqual(expectedBaseStageHelm)
})

it('builds the helm stage with previous stage', () => {
  expect(
    baseStageHelm({ appNamespace: 'app-namespace', appName: 'app-name' },
      'github-config', 'version', 'version.url', 'ref-if', ['req-ref-id'], 'Previous stage', '0e19100a-448d-4aa4-8fa0-7cf84e91ae10',
    )
  ).toEqual(expectedBaseHelmPreviousStages)
})
