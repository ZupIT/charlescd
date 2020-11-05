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

export interface Props {
  onSave: Function;
}

export interface Provider {
  label: string;
  value: string;
  icon?: string;
}

export interface MetricProvider {
  provider: string;
  authorId?: string;
  url: string;
}

export interface DatasourceData {
  [key: string]: string
}

export interface Datasource {
  id: string;
  name: string;
  pluginSrc: string;
  healthy: boolean;
  data: DatasourceData;
}

export interface Input {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

export interface PluginDatasource {
  configurationInputs: Input[];
  health: boolean;
}

export interface Plugin {
  id: string;
  name: string;
  src: string;
  description: string;
  inputParameters?: any;
}

export interface TestConnectionRequest {
  pluginSrc: string;
  data: any
}

export interface TestConnectionResponse {
  message?: string;
}

export enum ConnectionStatusEnum {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS'
}

export interface Response {
  id: string;
  provider: string;
}
