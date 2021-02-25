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

import { baseRequest, putRequest, postRequest, patchRequest } from './base';
import { Profile, NewUser } from 'modules/Users/interfaces/User';
import { CheckPassword } from 'modules/Account/interfaces/ChangePassword';
import { getWorkspaceId } from 'core/utils/workspace';
import { buildParams } from 'core/utils/query';
import { DEFAULT_PAGE_SIZE } from 'core/constants/request';

const endpoint = '/moove/v2/users';
const endpointWorkspaces = '/moove/v2/workspaces';
const v1Endpoint = '/moove/users';

export interface UserFilter {
  id?: string;
  name?: string;
  email?: string;
  page?: number;
}

const initialUserFilter = {
  name: '',
  page: 0
};

export const findAllWorkspaceUsers = (
  filter: UserFilter = initialUserFilter
) => {
  const workspaceId = getWorkspaceId();
  const page = '0';
  const size = '100';
  const params = buildParams({
    size,
    page,
    ...filter
  });

  return baseRequest(`${endpointWorkspaces}/${workspaceId}/users?${params}`);
};

export const findAllUsers = (filter: UserFilter = initialUserFilter) => {
  const params = new URLSearchParams({
    size: `${DEFAULT_PAGE_SIZE}`,
    page: `${filter.page ?? 0}`
  });

  if (filter?.name) params.append('name', filter?.name);
  if (filter?.email) params.append('email', filter?.email);

  return baseRequest(`${endpoint}?${params}`);
};

export const findAll = () => {
  const params = new URLSearchParams({
    size: `${DEFAULT_PAGE_SIZE}`,
    page: '0',
    sort: 'createdAt,desc'
  });

  return baseRequest(`${v1Endpoint}?${params}`);
};

export const resetPasswordById = (id: string) =>
  putRequest(`${endpoint}/${id}/reset-password`);

export const updateProfileById = (id: string, profile: Profile) =>
  putRequest(`${v1Endpoint}/${id}`, profile);

export const patchProfileById = (id: string, name: string) =>
  patchRequest(`${endpoint}/${id}`, 'replace', '/name', name);

export const findUserByEmail = (email: string) => {
  const decodeEmail = btoa(email);

  return baseRequest(`${endpoint}/${decodeEmail}`);
};

export const findWorkspacesByUserId = (id: string) => {
  return baseRequest(`${endpoint}/${id}/workspaces`);
};

export const deleteUserById = (id: string) =>
  baseRequest(`${v1Endpoint}/${id}`, null, { method: 'DELETE' });

export const createNewUser = (user: NewUser) =>
  postRequest(`${endpoint}`, user);

export const changePassword = (data: CheckPassword) =>
  putRequest(`${endpoint}/password`, data);
