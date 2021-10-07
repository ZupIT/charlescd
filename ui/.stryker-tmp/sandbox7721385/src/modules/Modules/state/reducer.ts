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

import { ModulesActionTypes, ACTION_TYPES } from './actions';
import { ModulePagination } from '../interfaces/ModulePagination';
import { ModuleState } from '../interfaces/ModuleState';
const initialListState: ModulePagination = stryMutAct_9fa48("5533") ? {} : (stryCov_9fa48("5533"), {
  content: stryMutAct_9fa48("5534") ? ["Stryker was here"] : (stryCov_9fa48("5534"), []),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("5535") ? true : (stryCov_9fa48("5535"), false)
});
export const modulesInitialState: ModuleState = stryMutAct_9fa48("5536") ? {} : (stryCov_9fa48("5536"), {
  list: initialListState,
  item: null
});
export const modulesReducer = (state = modulesInitialState, action: ModulesActionTypes): ModuleState => {
  if (stryMutAct_9fa48("5537")) {
    {}
  } else {
    stryCov_9fa48("5537");

    switch (action.type) {
      case ACTION_TYPES.loadModules:
        if (stryMutAct_9fa48("5538")) {} else {
          stryCov_9fa48("5538");
          {
            if (stryMutAct_9fa48("5539")) {
              {}
            } else {
              stryCov_9fa48("5539");
              return stryMutAct_9fa48("5540") ? {} : (stryCov_9fa48("5540"), { ...state,
                list: stryMutAct_9fa48("5541") ? {} : (stryCov_9fa48("5541"), { ...action.payload,
                  content: stryMutAct_9fa48("5542") ? [] : (stryCov_9fa48("5542"), [...state.list.content, ...(stryMutAct_9fa48("5543") ? action?.payload?.content && [] : (stryCov_9fa48("5543"), (stryMutAct_9fa48("5545") ? action.payload?.content : stryMutAct_9fa48("5544") ? action?.payload.content : (stryCov_9fa48("5544", "5545"), action?.payload?.content)) ?? (stryMutAct_9fa48("5546") ? ["Stryker was here"] : (stryCov_9fa48("5546"), []))))])
                })
              });
            }
          }
        }

      case ACTION_TYPES.loadModule:
        if (stryMutAct_9fa48("5547")) {} else {
          stryCov_9fa48("5547");
          {
            if (stryMutAct_9fa48("5548")) {
              {}
            } else {
              stryCov_9fa48("5548");
              return stryMutAct_9fa48("5549") ? {} : (stryCov_9fa48("5549"), { ...state,
                item: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.loadComponent:
        if (stryMutAct_9fa48("5550")) {} else {
          stryCov_9fa48("5550");
          {
            if (stryMutAct_9fa48("5551")) {
              {}
            } else {
              stryCov_9fa48("5551");
              return stryMutAct_9fa48("5552") ? {} : (stryCov_9fa48("5552"), { ...state,
                item: stryMutAct_9fa48("5553") ? {} : (stryCov_9fa48("5553"), { ...state.item,
                  components: stryMutAct_9fa48("5554") ? [] : (stryCov_9fa48("5554"), [...state.item.components, action.payload])
                })
              });
            }
          }
        }

      case ACTION_TYPES.resetModule:
        if (stryMutAct_9fa48("5555")) {} else {
          stryCov_9fa48("5555");
          {
            if (stryMutAct_9fa48("5556")) {
              {}
            } else {
              stryCov_9fa48("5556");
              return stryMutAct_9fa48("5557") ? {} : (stryCov_9fa48("5557"), { ...state,
                item: modulesInitialState.item
              });
            }
          }
        }

      case ACTION_TYPES.resetModules:
        if (stryMutAct_9fa48("5558")) {} else {
          stryCov_9fa48("5558");
          {
            if (stryMutAct_9fa48("5559")) {
              {}
            } else {
              stryCov_9fa48("5559");
              return stryMutAct_9fa48("5560") ? {} : (stryCov_9fa48("5560"), { ...state,
                list: modulesInitialState.list
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("5561")) {} else {
          stryCov_9fa48("5561");
          {
            if (stryMutAct_9fa48("5562")) {
              {}
            } else {
              stryCov_9fa48("5562");
              return state;
            }
          }
        }

    }
  }
};