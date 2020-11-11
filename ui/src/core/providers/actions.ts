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

import { baseRequest, postRequest, deleteRequest } from './base';
import { ActionPayload } from 'modules/Settings/Credentials/Sections/MetricAction/types';

const endpoint = '/compass/api/v1';

export const getAllActions = () => baseRequest(`${endpoint}/actions`);

export const deleteActionById = (actionId: string) =>
  deleteRequest(`${endpoint}/actions/${actionId}`);

export const getPluginsByCategory = (category: string) => {
  const params = new URLSearchParams({
    category: `${category}`
  });

  return baseRequest(`${endpoint}/plugins?${params}`);
};

export const createAction = (payload: ActionPayload) =>
  postRequest(`${endpoint}/actions`, payload);
