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

import { WorkspacesActionTypes, ACTION_TYPES } from './actions';
import { WorkspacePagination } from '../interfaces/WorkspacePagination';
import { WorkspaceState } from '../interfaces/WorkspaceState';
import { WORKSPACE_STATUS } from '../enums';
const initialListState: WorkspacePagination = stryMutAct_9fa48("7150") ? {} : (stryCov_9fa48("7150"), {
  content: stryMutAct_9fa48("7151") ? ["Stryker was here"] : (stryCov_9fa48("7151"), []),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("7152") ? true : (stryCov_9fa48("7152"), false)
});
export const workspaceInitialState: WorkspaceState = stryMutAct_9fa48("7153") ? {} : (stryCov_9fa48("7153"), {
  list: initialListState,
  item: stryMutAct_9fa48("7154") ? {} : (stryCov_9fa48("7154"), {
    id: stryMutAct_9fa48("7155") ? "Stryker was here!" : (stryCov_9fa48("7155"), ''),
    name: stryMutAct_9fa48("7156") ? "Stryker was here!" : (stryCov_9fa48("7156"), ''),
    status: WORKSPACE_STATUS.COMPLETE,
    createdAt: stryMutAct_9fa48("7157") ? "Stryker was here!" : (stryCov_9fa48("7157"), '')
  }),
  permissions: stryMutAct_9fa48("7158") ? ["Stryker was here"] : (stryCov_9fa48("7158"), []),
  status: stryMutAct_9fa48("7159") ? "" : (stryCov_9fa48("7159"), 'idle')
});
export const workspaceReducer = (state = workspaceInitialState, action: WorkspacesActionTypes): WorkspaceState => {
  if (stryMutAct_9fa48("7160")) {
    {}
  } else {
    stryCov_9fa48("7160");

    switch (action.type) {
      case ACTION_TYPES.loadedWorkspaces:
        if (stryMutAct_9fa48("7161")) {} else {
          stryCov_9fa48("7161");
          {
            if (stryMutAct_9fa48("7162")) {
              {}
            } else {
              stryCov_9fa48("7162");
              return stryMutAct_9fa48("7163") ? {} : (stryCov_9fa48("7163"), { ...state,
                list: stryMutAct_9fa48("7164") ? {} : (stryCov_9fa48("7164"), { ...action.payload,
                  content: stryMutAct_9fa48("7165") ? [] : (stryCov_9fa48("7165"), [...state.list.content, ...(stryMutAct_9fa48("7166") ? action?.payload?.content && [] : (stryCov_9fa48("7166"), (stryMutAct_9fa48("7168") ? action.payload?.content : stryMutAct_9fa48("7167") ? action?.payload.content : (stryCov_9fa48("7167", "7168"), action?.payload?.content)) ?? (stryMutAct_9fa48("7169") ? ["Stryker was here"] : (stryCov_9fa48("7169"), []))))])
                })
              });
            }
          }
        }

      case ACTION_TYPES.loadedWorkspace:
        if (stryMutAct_9fa48("7170")) {} else {
          stryCov_9fa48("7170");
          {
            if (stryMutAct_9fa48("7171")) {
              {}
            } else {
              stryCov_9fa48("7171");
              return stryMutAct_9fa48("7172") ? {} : (stryCov_9fa48("7172"), { ...state,
                item: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.statusWorkspace:
        if (stryMutAct_9fa48("7173")) {} else {
          stryCov_9fa48("7173");
          {
            if (stryMutAct_9fa48("7174")) {
              {}
            } else {
              stryCov_9fa48("7174");
              return stryMutAct_9fa48("7175") ? {} : (stryCov_9fa48("7175"), { ...state,
                status: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.resetContent:
        if (stryMutAct_9fa48("7176")) {} else {
          stryCov_9fa48("7176");
          {
            if (stryMutAct_9fa48("7177")) {
              {}
            } else {
              stryCov_9fa48("7177");
              return stryMutAct_9fa48("7178") ? {} : (stryCov_9fa48("7178"), { ...state,
                list: stryMutAct_9fa48("7179") ? {} : (stryCov_9fa48("7179"), { ...state.list,
                  content: stryMutAct_9fa48("7180") ? ["Stryker was here"] : (stryCov_9fa48("7180"), [])
                })
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("7181")) {} else {
          stryCov_9fa48("7181");
          {
            if (stryMutAct_9fa48("7182")) {
              {}
            } else {
              stryCov_9fa48("7182");
              return state;
            }
          }
        }

    }
  }
};