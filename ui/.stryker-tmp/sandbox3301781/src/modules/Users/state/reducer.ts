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

import { UsersActionTypes, ACTION_TYPES } from './actions';
import { UserPagination } from '../interfaces/UserPagination';
import { UserState } from '../interfaces/UserState';
const initialListState: UserPagination = stryMutAct_9fa48("6905") ? {} : (stryCov_9fa48("6905"), {
  content: stryMutAct_9fa48("6906") ? ["Stryker was here"] : (stryCov_9fa48("6906"), []),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("6907") ? true : (stryCov_9fa48("6907"), false)
});
export const userInitialState: UserState = stryMutAct_9fa48("6908") ? {} : (stryCov_9fa48("6908"), {
  list: initialListState,
  item: null
});
export const userReducer = (state = userInitialState, action: UsersActionTypes): UserState => {
  if (stryMutAct_9fa48("6909")) {
    {}
  } else {
    stryCov_9fa48("6909");

    switch (action.type) {
      case ACTION_TYPES.loadedUsers:
        if (stryMutAct_9fa48("6910")) {} else {
          stryCov_9fa48("6910");
          {
            if (stryMutAct_9fa48("6911")) {
              {}
            } else {
              stryCov_9fa48("6911");
              return stryMutAct_9fa48("6912") ? {} : (stryCov_9fa48("6912"), { ...state,
                list: stryMutAct_9fa48("6913") ? {} : (stryCov_9fa48("6913"), { ...action.payload,
                  content: stryMutAct_9fa48("6914") ? [] : (stryCov_9fa48("6914"), [...state.list.content, ...(stryMutAct_9fa48("6915") ? action?.payload?.content && [] : (stryCov_9fa48("6915"), (stryMutAct_9fa48("6917") ? action.payload?.content : stryMutAct_9fa48("6916") ? action?.payload.content : (stryCov_9fa48("6916", "6917"), action?.payload?.content)) ?? (stryMutAct_9fa48("6918") ? ["Stryker was here"] : (stryCov_9fa48("6918"), []))))])
                })
              });
            }
          }
        }

      case ACTION_TYPES.loadedUser:
        if (stryMutAct_9fa48("6919")) {} else {
          stryCov_9fa48("6919");
          {
            if (stryMutAct_9fa48("6920")) {
              {}
            } else {
              stryCov_9fa48("6920");
              return stryMutAct_9fa48("6921") ? {} : (stryCov_9fa48("6921"), { ...state,
                item: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.resetContent:
        if (stryMutAct_9fa48("6922")) {} else {
          stryCov_9fa48("6922");
          {
            if (stryMutAct_9fa48("6923")) {
              {}
            } else {
              stryCov_9fa48("6923");
              return stryMutAct_9fa48("6924") ? {} : (stryCov_9fa48("6924"), { ...state,
                list: stryMutAct_9fa48("6925") ? {} : (stryCov_9fa48("6925"), { ...state.list,
                  content: stryMutAct_9fa48("6926") ? ["Stryker was here"] : (stryCov_9fa48("6926"), [])
                })
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("6927")) {} else {
          stryCov_9fa48("6927");
          {
            if (stryMutAct_9fa48("6928")) {
              {}
            } else {
              stryCov_9fa48("6928");
              return state;
            }
          }
        }

    }
  }
};