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

import { DEFAULT_PAGE_SIZE } from 'core/constants/request';
import { Token } from 'modules/Tokens/interfaces';
import { baseRequest, postRequest, putRequest } from './base';

const endpoint = '/gate/api/v1/system-token';

const initialModulesFilter: ModulesFilter = {
  name: '',
  page: 0
};

export interface ModulesFilter {
  name?: string;
  page?: number;
}

export const findAll = (filter: ModulesFilter = initialModulesFilter) => {
  const params = new URLSearchParams({
    size: `${DEFAULT_PAGE_SIZE}`,
    name: filter?.name || '',
    page: `${filter.page ?? 0}`
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const findById = (id: string) => baseRequest(`${endpoint}/${id}`);

export const create = (token: Token) =>
  postRequest(`${endpoint}`, token);

export const revoke = (id: string) =>
  postRequest(`${endpoint}/${id}/revoke`);

export const regenerate = (id: string) =>
  putRequest(`${endpoint}/${id}/regenerate`);
