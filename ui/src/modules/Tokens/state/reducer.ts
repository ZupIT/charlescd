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

import { TokensActionTypes, ACTION_TYPES } from './actions';
import { TokenPagination } from '../interfaces/TokenPagination';
import map from 'lodash/map';

export interface TokensState {
  list: TokenPagination;
}

export const tokensInitialState: TokensState = {
  list: {
    content: [],
    page: 0,
    size: 0,
    totalPages: 0,
    last: false
  }
};

export const tokensReducer = (
  state = tokensInitialState,
  action: TokensActionTypes
): TokensState => {
  switch (action.type) {
    case ACTION_TYPES.loadedTokens: {
      return {
        ...state,
        list: {
          ...action.payload,
          content: [...state.list.content, ...(action?.payload?.content ?? [])]
        }
      };
    }
    case ACTION_TYPES.clearTokens: {
      return {
        ...state,
        list: {
          ...state.list,
          content: []
        }
      };
    }
    case ACTION_TYPES.updateTokens: {
      const { payload } = action;
      const newToken = payload;
      const content = map(state.list.content, token => {
        return token?.id === newToken?.id ? newToken : token;
      });

      return {
        ...state,
        list: {
          ...state.list,
          content
        }
      };
    }
    default: {
      return state;
    }
  }
};
