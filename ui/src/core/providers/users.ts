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

import { baseRequest, putRequest, postRequest } from './base';
import { Profile, NewUser } from 'modules/Users/interfaces/User';

const endpoint = '/moove/v2/users';
const endpointWorkspaces = '/moove/v2/workspaces/users';
const v1Endpoint = '/moove/users';

export interface UserFilter {
  name?: string;
  email?: string;
}

const initialUserFilter = {
  email: ''
};

export const findAllWorkspaceUsers = (
  filter: UserFilter = initialUserFilter
) => {
  const defaultPage = 0;
  const defaultSize = 100;
  const params = new URLSearchParams({
    size: `${defaultSize}`,
    page: `${defaultPage}`
  });

  if (filter?.name) params.append('name', filter?.name);
  if (filter?.email) params.append('email', filter?.email);

  return baseRequest(`${endpointWorkspaces}?${params}`);
};

export const findAllUsers = (filter: UserFilter = initialUserFilter) => {
  const defaultPage = 0;
  const defaultSize = 100;
  const params = new URLSearchParams({
    size: `${defaultSize}`,
    page: `${defaultPage}`
  });

  if (filter?.name) params.append('name', filter?.name);
  if (filter?.email) params.append('email', filter?.email);

  return baseRequest(`${endpoint}?${params}`);
};

export const findAll = () => {
  const params = new URLSearchParams({
    size: '100',
    page: '0',
    sort: 'createdAt,desc'
  });

  return baseRequest(`${v1Endpoint}?${params}`);
};

export const updateProfileById = (id: string, profile: Profile) =>
  putRequest(`${v1Endpoint}/${id}`, profile);

export const findUserByEmail = (email: string) => {
  const decodeEmail = btoa(email);

  return baseRequest(`${endpoint}/${decodeEmail}`);
};

export const deleteUserById = (id: string) =>
  baseRequest(`${v1Endpoint}/${id}`, null, { method: 'DELETE' });

export const createNewUser = (user: NewUser) =>
  postRequest(`${endpoint}`, user);
