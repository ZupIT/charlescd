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

import { UsersActionTypes, ACTION_TYPES } from './actions';
import { UserPagination } from '../interfaces/UserPagination';
import { UserState } from '../interfaces/UserState';

const initialListState: UserPagination = {
  content: [],
  page: 0,
  size: 0,
  totalPages: 0,
  last: false
};

export const userInitialState: UserState = {
  list: initialListState,
  item: null
};

export const userReducer = (
  state = userInitialState,
  action: UsersActionTypes
): UserState => {
  switch (action.type) {
    case ACTION_TYPES.loadedUsers: {
      return {
        ...state,
        list: action.payload
      };
    }
    case ACTION_TYPES.loadedUser: {
      return {
        ...state,
        item: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
