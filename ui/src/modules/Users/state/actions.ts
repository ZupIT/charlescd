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

import { UserPagination } from '../interfaces/UserPagination';
import { User } from '../interfaces/User';

export enum ACTION_TYPES {
  loadedUsers = 'USERS/LOADED_USERS',
  loadedUser = 'USERS/LOADED_USER'
}

interface LoadedUsersActionType {
  type: typeof ACTION_TYPES.loadedUsers;
  payload: UserPagination;
}

interface LoadedUserActionType {
  type: typeof ACTION_TYPES.loadedUser;
  payload: User;
}

export const LoadedUsersAction = (
  payload: UserPagination
): UsersActionTypes => ({
  type: ACTION_TYPES.loadedUsers,
  payload
});

export const LoadedUserAction = (payload: User): UsersActionTypes => ({
  type: ACTION_TYPES.loadedUser,
  payload
});

export type UsersActionTypes = LoadedUsersActionType | LoadedUserActionType;
