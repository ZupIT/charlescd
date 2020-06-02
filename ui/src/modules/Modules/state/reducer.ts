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

import { ModulesActionTypes, ACTION_TYPES } from './actions';
import { ModulePagination } from '../interfaces/ModulePagination';
import { ModuleState } from '../interfaces/ModuleState';

const initialListState: ModulePagination = {
  content: [],
  page: 0,
  size: 0,
  totalPages: 0,
  last: false
};

export const modulesInitialState: ModuleState = {
  list: initialListState,
  item: null
};

export const modulesReducer = (
  state = modulesInitialState,
  action: ModulesActionTypes
): ModuleState => {
  switch (action.type) {
    case ACTION_TYPES.loadModules: {
      return {
        ...state,
        list: action.payload
      };
    }
    case ACTION_TYPES.loadModule: {
      return {
        ...state,
        item: action.payload
      };
    }
    case ACTION_TYPES.loadComponent: {
      return {
        ...state,
        item: {
          ...state.item,
          components: [...state.item.components, action.payload]
        }
      };
    }
    case ACTION_TYPES.resetModule: {
      return {
        ...state,
        item: modulesInitialState.item
      };
    }
    default: {
      return state;
    }
  }
};
