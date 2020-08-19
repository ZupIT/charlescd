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

import { WorkspacesActionTypes, ACTION_TYPES } from './actions';
import { WorkspacePagination } from '../interfaces/WorkspacePagination';
import { WorkspaceState } from '../interfaces/WorkspaceState';
import { WORKSPACE_STATUS } from '../enums';

const initialListState: WorkspacePagination = {
  content: [],
  page: 0,
  size: 0,
  totalPages: 0,
  last: false
};

export const workspaceInitialState: WorkspaceState = {
  list: initialListState,
  item: {
    id: '',
    name: '',
    status: WORKSPACE_STATUS.COMPLETE,
    authorId: '',
    createdAt: ''
  },
  status: 'idle'
};

export const workspaceReducer = (
  state = workspaceInitialState,
  action: WorkspacesActionTypes
): WorkspaceState => {
  switch (action.type) {
    case ACTION_TYPES.loadedWorkspaces: {
      return {
        ...state,
        list: action.payload
      };
    }
    case ACTION_TYPES.loadedWorkspace: {
      return {
        ...state,
        item: action.payload
      };
    }
    case ACTION_TYPES.statusWorkspace: {
      return {
        ...state,
        status: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
