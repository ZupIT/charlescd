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

import { Webhook } from 'modules/Settings/Credentials/Sections/Webhook/interfaces';
import { postRequest, patchRequest, baseRequest, deleteRequest } from './base';

export const mooveEndpoint = '/moove/v1';
export const endpoint = `${mooveEndpoint}/webhooks`;

export const saveConfig = (webhook: Webhook) => postRequest(endpoint, webhook);

export const getConfig = (id: string) => baseRequest(`${endpoint}/${id}`);

export const editConfig = (id: string, value: string[]) =>
  patchRequest(`${endpoint}/${id}`, 'replace', '/events', value);

export const delConfig = (id: string) => deleteRequest(`${endpoint}/${id}`);
