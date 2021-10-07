// @ts-nocheck
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
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { Token } from '../interfaces';
import { TokenPagination } from '../interfaces/TokenPagination';
export enum ACTION_TYPES {
  loadedTokens = 'TOKENS/LOADED',
  clearTokens = 'TOKENS/CLEAR',
  updateTokens = 'TOKENS/UPDATE',
}
interface LoadedTokens {
  type: typeof ACTION_TYPES.loadedTokens;
  payload: TokenPagination;
}
export const loadedTokens = stryMutAct_9fa48("6729") ? () => undefined : (stryCov_9fa48("6729"), (() => {
  const loadedTokens = (payload: TokenPagination): LoadedTokens => stryMutAct_9fa48("6730") ? {} : (stryCov_9fa48("6730"), {
    type: ACTION_TYPES.loadedTokens,
    payload
  });

  return loadedTokens;
})());
interface ClearTokens {
  type: typeof ACTION_TYPES.clearTokens;
}
export const clearTokens = stryMutAct_9fa48("6731") ? () => undefined : (stryCov_9fa48("6731"), (() => {
  const clearTokens = (): ClearTokens => stryMutAct_9fa48("6732") ? {} : (stryCov_9fa48("6732"), {
    type: ACTION_TYPES.clearTokens
  });

  return clearTokens;
})());
interface UpdateTokens {
  type: typeof ACTION_TYPES.updateTokens;
  payload: Token;
}
export const updateTokens = stryMutAct_9fa48("6733") ? () => undefined : (stryCov_9fa48("6733"), (() => {
  const updateTokens = (payload: Token): UpdateTokens => stryMutAct_9fa48("6734") ? {} : (stryCov_9fa48("6734"), {
    type: ACTION_TYPES.updateTokens,
    payload
  });

  return updateTokens;
})());
export type TokensActionTypes = LoadedTokens | ClearTokens | UpdateTokens;