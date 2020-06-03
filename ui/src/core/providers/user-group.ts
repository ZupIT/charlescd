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

import { baseRequest } from './base';

const endpoint = '/moove/v2/user-groups';

export interface UserGroupFilter {
  name?: string;
}

export interface UserGroupSave {
  name: string;
  authorId: string;
}

export interface UserGroupMemberSave {
  memberId: string;
}

const initialGroupUserFilter = {
  name: ''
};

export const findAllUserGroup = (
  filter: UserGroupFilter = initialGroupUserFilter
) => {
  const sizeFixed = 200;
  const params = new URLSearchParams({
    size: `${sizeFixed}`,
    name: filter?.name
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const findUserGroupById = (id: string) =>
  baseRequest(`${endpoint}/${id}`);

export const saveUserGroup = (data: UserGroupSave) =>
  baseRequest(`${endpoint}`, data, { method: 'POST' });

export const updateUserGroup = (id: string, data: UserGroupSave) =>
  baseRequest(`${endpoint}/${id}`, data, { method: 'PUT' });

export const deleteUserGroup = (id: string) =>
  baseRequest(`${endpoint}/${id}`, null, { method: 'DELETE' });

export const addMemberToUserGroup = (id: string, data: UserGroupMemberSave) =>
  baseRequest(`${endpoint}/${id}/members`, data, { method: 'POST' });

export const removeMemberToUserGroup = (
  userGroupId: string,
  memberId: string
) =>
  baseRequest(`${endpoint}/${userGroupId}/members/${memberId}`, null, {
    method: 'DELETE'
  });
