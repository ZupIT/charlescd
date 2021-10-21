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

import { buildConnectionPayload } from '../helpers'
import { Credentials, GitFormData } from '../interfaces';

test('github address', async () => {
  const git: GitFormData = {
    name: 'git',
    credentials: {
      accessToken: '1a2b3c4d5e6f7g',
      serviceProvider: 'GitHub'
    } 
  };

  const expectGit = {
    credentials: {
      address: 'https://github.com',
      accessToken: '1a2b3c4d5e6f7g',
      serviceProvider: 'GITHUB'
    } 
  };
  expect(buildConnectionPayload(git, "GitHub")).toEqual(expectGit)
})

test('gitlab address', async () => {
  const git: GitFormData = {
    name: 'git',
    credentials: {
      address: 'https://gitlab.com/example',
      accessToken: '1a2b3c4d5e6f7g',
      serviceProvider: 'GitLab'
    } 
  };

  const expectGit = {
    credentials: {
      address: 'https://gitlab.com/example',
      accessToken: '1a2b3c4d5e6f7g',
      serviceProvider: 'GITLAB'
    } 
  };
  expect(buildConnectionPayload(git, "GitLab")).toEqual(expectGit)
})