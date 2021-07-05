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

import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { Build, Deployment, Feature } from 'modules/Circles/Release/interfaces/Build';
import { Scope } from 'modules/Circles/Release/Metadata/interfaces';
import { getBuildOptions, getMetadata, toKeyValue } from "../helpers"

const formMetadata = {
  scope: Scope.APPLICATION,
  content: [{
    key: 'key',
    value: 'value'
  }]
}

const deployment: Deployment = {
  id: '456',
  buildId: '789',
  metadata: {
    scope: Scope.APPLICATION,
    content: {
      'key': 'value'
    },
  },
  status: DEPLOYMENT_STATUS.deployed,
  deployedAt: '2021-01-01',
}

const feature: Feature = {
  id: '456',
  name: 'feature',
  branchName: 'feature',
  authorName: 'charles',
  modules: [{
    id: '789',
    name: 'ZupIT/charlescd',
    gitRepositoryAddress: '',
    helmRepository: ''
  }]
}

const build: Build = {
  id: '123',
  createdAt: '2021-01-01',
  features: [feature],
  status: '',
  deployments: [deployment],
  tag: 'rc-1'
}

test("should getBuildOptions", () => {
  const options = getBuildOptions([build]);

  expect(options).toStrictEqual([{ value: build.id, label: build.tag }]);
});

test("should getMetadata", () => {
  const options = getMetadata(build);

  expect(options).toStrictEqual([{ key: 'key', value: 'value' }]);
});

test("should toKeyValue", () => {
  const options = toKeyValue(formMetadata);

  expect(options).toStrictEqual({ 'key': 'value' });
});
