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

export const endpoint = '/moove/v2/workspaces';

export interface Patch {
  op: string;
  path: string;
  value: string;
}

export interface Filter {
  id?: string;
  name?: string;
}

export interface WorkspaceSave {
  name: string;
  authorId: string;
}

const initialFilter = {
  name: ''
};

export const findAll = (filter: Filter = initialFilter) => {
  const sizeFixed = 200;
  const params = new URLSearchParams({
    size: `${sizeFixed}`,
    name: filter?.name
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
