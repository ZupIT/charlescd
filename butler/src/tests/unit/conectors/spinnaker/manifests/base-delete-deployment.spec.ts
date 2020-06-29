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
import baseDeleteDeployments from '../../../../../app/core/integrations/cd/spinnaker/connector/utils/manifests/base-delete-deployment'
import expectedBaseDeleteDeployment from '../fixtures/manifests/expected-base-delete-deployment'
import { CallbackTypeEnum } from '../../../../../app/api/notifications/enums/callback-type.enum'
it('builds base deployment delete manifest', () => {

  expect(
    baseDeleteDeployments(
      {
        account: 'account', appName: 'app-namespace', unusedVersions: [{version: 'unused-version', versionUrl: 'version-url'}],
        applicationName: 'app-name', appNamespace: 'app-namespace',
        circleId: 'circle-id', circles: [], githubAccount: 'github-account',
        helmRepository: 'https://api.github.com/repos/org/repo/contents/',
        pipelineName: 'pipeline-name', versions: [], webhookUri: 'webhook-uri', url: 'https://spinnaker.url.com',
        callbackType : CallbackTypeEnum.DEPLOYMENT
      },
      123, ['req-ref-id'], 'prev-stage')
  ).toEqual(expectedBaseDeleteDeployment)
})
