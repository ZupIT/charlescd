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

export const MODULE = {
  "id": "123",
  "name": "module 1",
  "gitRepositoryAddress": "https://github.com/example",
  "helmRepository": "undefined/api/v4/projects/undefined/repository?ref=main",
  "createdAt": "2021-02-03 11:34:51",
  "components": [
    {
      "id": "456",
      "name": "component 1",
      "createdAt": "2021-02-03 11:34:51",
      "errorThreshold": 10,
      "latencyThreshold": 5
    }
  ]
};

export const MODULES = {
  "content": [
    {
      "id": "123",
      "name": "module 1",
      "gitRepositoryAddress": "https://github.com/example",
      "helmRepository": "undefined/api/v4/projects/undefined/repository?ref=main",
      "createdAt": "2021-02-03 11:34:51",
      "components": [
        {
          "id": "456",
          "name": "component 1",
          "createdAt": "2021-02-03 11:34:51",
          "errorThreshold": 10,
          "latencyThreshold": 5
        }
      ]
    }
  ],
  "page": 0,
  "size": 5,
  "totalPages": 1,
  "last": true
};
