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

import { Action, PluginsPayload, inputParameters } from "../types"

export const actionsData: Action[] = [
  {
    'id': '1',
    'nickname': 'Action 1'
  },
  {
    'id': '2',
    'nickname': 'Action 2'
  }
];

export const pluginsData = [
  {
    'id': '1',
    'category': 'actionDeploy',
    'name': 'plugin 1',
    'src': 'plugin/action/deploy',
    'description': 'deploy plugin 1',
    'inputParameters': 'input 1'
  },
  {
    'id': '1',
    'category': 'actionDeploy',
    'name': 'plugin 1',
    'src': 'plugin/action/deploy',
    'description': 'deploy plugin 1',
    'inputParameters': 'input 1'
  }
];
