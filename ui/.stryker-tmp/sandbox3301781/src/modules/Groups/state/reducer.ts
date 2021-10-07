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

import map from 'lodash/map';
import { UserGroupsActionTypes, ACTION_TYPES } from './actions';
import { UserGroupPagination } from '../interfaces/UserGroupsPagination';
import { UserGroupState } from '../interfaces/UserGroupState';
export const initialListState: UserGroupPagination = stryMutAct_9fa48("4597") ? {} : (stryCov_9fa48("4597"), {
  content: stryMutAct_9fa48("4598") ? ["Stryker was here"] : (stryCov_9fa48("4598"), []),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("4599") ? true : (stryCov_9fa48("4599"), false)
});
export const userGroupInitialState: UserGroupState = stryMutAct_9fa48("4600") ? {} : (stryCov_9fa48("4600"), {
  list: initialListState,
  item: null
});
export const userGroupReducer = (state = userGroupInitialState, action: UserGroupsActionTypes): UserGroupState => {
  if (stryMutAct_9fa48("4601")) {
    {}
  } else {
    stryCov_9fa48("4601");

    switch (action.type) {
      case ACTION_TYPES.loadedUserGroups:
        if (stryMutAct_9fa48("4602")) {} else {
          stryCov_9fa48("4602");
          {
            if (stryMutAct_9fa48("4603")) {
              {}
            } else {
              stryCov_9fa48("4603");
              return stryMutAct_9fa48("4604") ? {} : (stryCov_9fa48("4604"), { ...state,
                list: stryMutAct_9fa48("4605") ? {} : (stryCov_9fa48("4605"), { ...action.payload,
                  content: stryMutAct_9fa48("4606") ? [] : (stryCov_9fa48("4606"), [...state.list.content, ...(stryMutAct_9fa48("4607") ? action?.payload?.content && [] : (stryCov_9fa48("4607"), (stryMutAct_9fa48("4609") ? action.payload?.content : stryMutAct_9fa48("4608") ? action?.payload.content : (stryCov_9fa48("4608", "4609"), action?.payload?.content)) ?? (stryMutAct_9fa48("4610") ? ["Stryker was here"] : (stryCov_9fa48("4610"), []))))])
                })
              });
            }
          }
        }

      case ACTION_TYPES.loadedUserGroup:
        if (stryMutAct_9fa48("4611")) {} else {
          stryCov_9fa48("4611");
          {
            if (stryMutAct_9fa48("4612")) {
              {}
            } else {
              stryCov_9fa48("4612");
              return stryMutAct_9fa48("4613") ? {} : (stryCov_9fa48("4613"), { ...state,
                item: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.updateUserGroup:
        if (stryMutAct_9fa48("4614")) {} else {
          stryCov_9fa48("4614");
          {
            if (stryMutAct_9fa48("4615")) {
              {}
            } else {
              stryCov_9fa48("4615");
              const userGroups = map(state.list.content, userGroupItem => {
                if (stryMutAct_9fa48("4616")) {
                  {}
                } else {
                  stryCov_9fa48("4616");

                  if (stryMutAct_9fa48("4619") ? userGroupItem.id !== action.payload.id : stryMutAct_9fa48("4618") ? false : stryMutAct_9fa48("4617") ? true : (stryCov_9fa48("4617", "4618", "4619"), userGroupItem.id === action.payload.id)) {
                    if (stryMutAct_9fa48("4620")) {
                      {}
                    } else {
                      stryCov_9fa48("4620");
                      return action.payload;
                    }
                  }

                  return userGroupItem;
                }
              });
              return stryMutAct_9fa48("4621") ? {} : (stryCov_9fa48("4621"), { ...state,
                list: stryMutAct_9fa48("4622") ? {} : (stryCov_9fa48("4622"), { ...state.list,
                  content: stryMutAct_9fa48("4623") ? [] : (stryCov_9fa48("4623"), [...userGroups])
                })
              });
            }
          }
        }

      case ACTION_TYPES.resetUserGroups:
        if (stryMutAct_9fa48("4624")) {} else {
          stryCov_9fa48("4624");
          {
            if (stryMutAct_9fa48("4625")) {
              {}
            } else {
              stryCov_9fa48("4625");
              return stryMutAct_9fa48("4626") ? {} : (stryCov_9fa48("4626"), { ...state,
                list: userGroupInitialState.list
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("4627")) {} else {
          stryCov_9fa48("4627");
          {
            if (stryMutAct_9fa48("4628")) {
              {}
            } else {
              stryCov_9fa48("4628");
              return state;
            }
          }
        }

    }
  }
};