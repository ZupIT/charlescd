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

import { Token } from '../interfaces';
import { TokenPagination } from '../interfaces/TokenPagination';

export enum ACTION_TYPES {
  loadedTokens = 'TOKENS/LOADED',
  clearTokens = 'TOKENS/CLEAR',
  updateTokens = 'TOKENS/UPDATE'
}

interface LoadedTokens {
  type: typeof ACTION_TYPES.loadedTokens;
  payload: TokenPagination;
}

export const loadedTokens = (payload: TokenPagination): LoadedTokens => ({
  type: ACTION_TYPES.loadedTokens,
  payload
});

interface ClearTokens {
  type: typeof ACTION_TYPES.clearTokens;
}

export const clearTokens = (): ClearTokens => ({
  type: ACTION_TYPES.clearTokens
})

interface UpdateTokens {
  type: typeof ACTION_TYPES.updateTokens;
  payload: Token;
}

export const updateTokens = (payload: Token): UpdateTokens => ({
  type: ACTION_TYPES.updateTokens,
  payload
})

export type TokensActionTypes =
  LoadedTokens
  | ClearTokens
  | UpdateTokens;
