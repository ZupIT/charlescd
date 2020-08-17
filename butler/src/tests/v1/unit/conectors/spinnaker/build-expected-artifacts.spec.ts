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
import buildExpectedArtifacts from '../../../../../app/v1/core/integrations/cd/spinnaker/connector/utils/helpers/build-expected-artifacts'
import expectedArtifactTemplate from './fixtures/expected-artifacts-template'
import expectedArtifactValue from './fixtures/expected-artifacts-value'

it('builds the correct template object', () => {

  expect(
    buildExpectedArtifacts('https://api.github.com/repos/org/repo/contents/', 'github-account', 'app-name', 'template')
  ).toEqual(expectedArtifactTemplate)

})

it('builds the correct values object', () => {

  expect(
    buildExpectedArtifacts('https://api.github.com/repos/org/repo/contents/', 'github-account', 'app-name', 'value')
  ).toEqual(expectedArtifactValue)

})
