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

const user = {
  id: '1',
  name: 'Charles',
  email: 'charlescd@zup.com.br',
  createdAt: ''
}

export const workspaces = {
  content: [
    {
      id: '123',
      name: 'Workspace 1',
      users: [user],
      status: 'COMPLETE',
    },
    {
      id: '456',
      name: 'Workspace 2',
      users: [user],
      status: 'INCOMPLETE',
    }
  ],
  page: 0,
  size: 0,
  totalPages: 0,
  last: true
};