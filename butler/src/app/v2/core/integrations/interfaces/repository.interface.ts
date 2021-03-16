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

export interface RequestConfig {
  url: string,
  token: string,
  resourceName: string
}

export enum ResourceType {
  FILE = 'file',
  DIR = 'directory'
}

export interface Resource {
  name: string,
  type: ResourceType,
  content?: string,
  children?: Resource[]
}

export interface Repository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getResource(config: RequestConfig): Promise<Resource>
}
