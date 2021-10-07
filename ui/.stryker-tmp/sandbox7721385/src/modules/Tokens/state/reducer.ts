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
// @ts-nocheck

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

import { TokensActionTypes, ACTION_TYPES } from './actions';
import { TokenPagination } from '../interfaces/TokenPagination';
import map from 'lodash/map';
export interface TokensState {
  list: TokenPagination;
}
export const tokensInitialState: TokensState = stryMutAct_9fa48("6735") ? {} : (stryCov_9fa48("6735"), {
  list: stryMutAct_9fa48("6736") ? {} : (stryCov_9fa48("6736"), {
    content: stryMutAct_9fa48("6737") ? ["Stryker was here"] : (stryCov_9fa48("6737"), []),
    page: 0,
    size: 0,
    totalPages: 0,
    last: stryMutAct_9fa48("6738") ? true : (stryCov_9fa48("6738"), false)
  })
});
export const tokensReducer = (state = tokensInitialState, action: TokensActionTypes): TokensState => {
  if (stryMutAct_9fa48("6739")) {
    {}
  } else {
    stryCov_9fa48("6739");

    switch (action.type) {
      case ACTION_TYPES.loadedTokens:
        if (stryMutAct_9fa48("6740")) {} else {
          stryCov_9fa48("6740");
          {
            if (stryMutAct_9fa48("6741")) {
              {}
            } else {
              stryCov_9fa48("6741");
              return stryMutAct_9fa48("6742") ? {} : (stryCov_9fa48("6742"), { ...state,
                list: stryMutAct_9fa48("6743") ? {} : (stryCov_9fa48("6743"), { ...action.payload,
                  content: stryMutAct_9fa48("6744") ? [] : (stryCov_9fa48("6744"), [...state.list.content, ...(stryMutAct_9fa48("6745") ? action?.payload?.content && [] : (stryCov_9fa48("6745"), (stryMutAct_9fa48("6747") ? action.payload?.content : stryMutAct_9fa48("6746") ? action?.payload.content : (stryCov_9fa48("6746", "6747"), action?.payload?.content)) ?? (stryMutAct_9fa48("6748") ? ["Stryker was here"] : (stryCov_9fa48("6748"), []))))])
                })
              });
            }
          }
        }

      case ACTION_TYPES.clearTokens:
        if (stryMutAct_9fa48("6749")) {} else {
          stryCov_9fa48("6749");
          {
            if (stryMutAct_9fa48("6750")) {
              {}
            } else {
              stryCov_9fa48("6750");
              return stryMutAct_9fa48("6751") ? {} : (stryCov_9fa48("6751"), { ...state,
                list: stryMutAct_9fa48("6752") ? {} : (stryCov_9fa48("6752"), { ...state.list,
                  content: stryMutAct_9fa48("6753") ? ["Stryker was here"] : (stryCov_9fa48("6753"), [])
                })
              });
            }
          }
        }

      case ACTION_TYPES.updateTokens:
        if (stryMutAct_9fa48("6754")) {} else {
          stryCov_9fa48("6754");
          {
            if (stryMutAct_9fa48("6755")) {
              {}
            } else {
              stryCov_9fa48("6755");
              const {
                payload
              } = action;
              const newToken = payload;
              const content = map(state.list.content, token => {
                if (stryMutAct_9fa48("6756")) {
                  {}
                } else {
                  stryCov_9fa48("6756");
                  return (stryMutAct_9fa48("6759") ? token?.id !== newToken?.id : stryMutAct_9fa48("6758") ? false : stryMutAct_9fa48("6757") ? true : (stryCov_9fa48("6757", "6758", "6759"), (stryMutAct_9fa48("6760") ? token.id : (stryCov_9fa48("6760"), token?.id)) === (stryMutAct_9fa48("6761") ? newToken.id : (stryCov_9fa48("6761"), newToken?.id)))) ? newToken : token;
                }
              });
              return stryMutAct_9fa48("6762") ? {} : (stryCov_9fa48("6762"), { ...state,
                list: stryMutAct_9fa48("6763") ? {} : (stryCov_9fa48("6763"), { ...state.list,
                  content
                })
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("6764")) {} else {
          stryCov_9fa48("6764");
          {
            if (stryMutAct_9fa48("6765")) {
              {}
            } else {
              stryCov_9fa48("6765");
              return state;
            }
          }
        }

    }
  }
};