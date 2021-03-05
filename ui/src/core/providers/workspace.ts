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

import { baseRequest, patchRequest } from './base';
import { getWorkspaceId } from 'core/utils/workspace';
import { DEFAULT_PAGE_SIZE } from 'core/constants/request';

export const mooveEndpoint = '/moove/v2';
export const endpoint = `${mooveEndpoint}/workspaces`;

export interface Patch {
  op: string;
  path: string;
  value: string;
}

export interface Filter {
  id?: string;
  name?: string;
  page?: number;
}

export interface WorkspaceSave {
  name: string;
}

export type GitConnectionTest = {
  credentials: {
    address: string;
    accessToken: string;
    serviceProvider: string;
  };
};

const initialFilter = {
  name: '',
  page: 0
};

export const findAll = (filter: Filter = initialFilter) => {
  const params = new URLSearchParams({
    size: `${DEFAULT_PAGE_SIZE}`,
    name: filter?.name || '',
    page: `${filter.page ?? 0}`
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const saveWorkspaceName = (data: WorkspaceSave) =>
  baseRequest(`${endpoint}`, data, { method: 'POST' });

export const findById = (filter: Filter) =>
  baseRequest(`${endpoint}/${filter?.id}`);

export const updateName = (value: string) =>
  patchRequest(`${endpoint}/${getWorkspaceId()}`, 'replace', '/name', value);

export const addConfig = (path: string, value: string) =>
  patchRequest(`${endpoint}/${getWorkspaceId()}`, 'replace', path, value);

export const delConfig = (path: string) =>
  patchRequest(`${endpoint}/${getWorkspaceId()}`, 'remove', path);

export const testGitConnection = (data: GitConnectionTest) =>
  baseRequest(`${mooveEndpoint}/configurations/git/connection-status`, data, {
    method: 'POST'
  });
