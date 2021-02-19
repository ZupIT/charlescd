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

import { UserGroupPagination } from '../interfaces/UserGroupsPagination';
import { UserGroup } from '../interfaces/UserGroups';

export enum ACTION_TYPES {
  loadedUserGroups = 'USER_GROUPS/LOADED_USERS_GROUPS',
  loadedUserGroup = 'USER_GROUPS/GET_USER_GROUP',
  resetUserGroups = 'USER_GROUPS/RESET_USERS_GROUPS'
}

interface ListUserGroupsActionType {
  type: typeof ACTION_TYPES.loadedUserGroups;
  payload: UserGroupPagination;
}

interface GetUserGroupActionType {
  type: typeof ACTION_TYPES.loadedUserGroup;
  payload: UserGroup;
}

interface ResetUserGroupsType {
  type: typeof ACTION_TYPES.resetUserGroups;
}

export const loadUserGroupsAction = (
  payload: UserGroupPagination
): UserGroupsActionTypes => ({
  type: ACTION_TYPES.loadedUserGroups,
  payload
});

export const loadUserGroupAction = (
  payload: UserGroup
): UserGroupsActionTypes => ({
  type: ACTION_TYPES.loadedUserGroup,
  payload
});

export const resetUserGroupsAction = (): UserGroupsActionTypes => ({
  type: ACTION_TYPES.resetUserGroups
});

export type UserGroupsActionTypes =
  | ListUserGroupsActionType
  | GetUserGroupActionType
  | ResetUserGroupsType;
