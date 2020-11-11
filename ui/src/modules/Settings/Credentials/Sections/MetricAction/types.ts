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

export type Action = {
  id: string;
  nickname: string;
};

export type ActionConfiguration = {
  mooveUrl: string;
};

export type ActionForm = {
  nickname: string;
  description: string;
  type: string;
  configuration: string;
};

export type ActionPayload = {
  nickname: string;
  description: string;
  type: string;
  useDefaultConfiguration: boolean;
  configuration?: ActionConfiguration;
};

type executionInputs = {
  label: string;
  name: string;
  required: boolean;
  type: string;
};

type configurationInputs = {
  label: string;
  name: string;
  required: boolean;
  type: string;
};

type inputParameters = {
  configurationInputs: configurationInputs[];
  executionInputs: executionInputs[];
};

export type PluginsPayload = {
  id: string;
  category: string;
  name: string;
  src: string;
  description: string;
  inputParameters: inputParameters;
};
