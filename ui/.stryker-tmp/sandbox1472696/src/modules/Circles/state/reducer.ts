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
import { CircleState } from '../interfaces/CircleState';
import { CirclesActionTypes, ACTION_TYPES } from './actions';
import { CirclePagination } from '../interfaces/CirclesPagination';
const initialListState: CirclePagination = stryMutAct_9fa48("4207") ? {} : (stryCov_9fa48("4207"), {
  content: stryMutAct_9fa48("4208") ? ["Stryker was here"] : (stryCov_9fa48("4208"), []),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("4209") ? true : (stryCov_9fa48("4209"), false)
});
export const circlesInitialState: CircleState = stryMutAct_9fa48("4210") ? {} : (stryCov_9fa48("4210"), {
  list: initialListState,
  metrics: initialListState,
  item: null
});
export const circlesReducer = (state = circlesInitialState, action: CirclesActionTypes): CircleState => {
  if (stryMutAct_9fa48("4211")) {
    {}
  } else {
    stryCov_9fa48("4211");

    switch (action.type) {
      case ACTION_TYPES.loadedCircles:
        if (stryMutAct_9fa48("4212")) {} else {
          stryCov_9fa48("4212");
          {
            if (stryMutAct_9fa48("4213")) {
              {}
            } else {
              stryCov_9fa48("4213");
              return stryMutAct_9fa48("4214") ? {} : (stryCov_9fa48("4214"), { ...state,
                list: stryMutAct_9fa48("4215") ? {} : (stryCov_9fa48("4215"), { ...action.payload,
                  content: stryMutAct_9fa48("4216") ? [] : (stryCov_9fa48("4216"), [...state.list.content, ...(stryMutAct_9fa48("4217") ? action?.payload?.content && [] : (stryCov_9fa48("4217"), (stryMutAct_9fa48("4219") ? action.payload?.content : stryMutAct_9fa48("4218") ? action?.payload.content : (stryCov_9fa48("4218", "4219"), action?.payload?.content)) ?? (stryMutAct_9fa48("4220") ? ["Stryker was here"] : (stryCov_9fa48("4220"), []))))])
                })
              });
            }
          }
        }

      case ACTION_TYPES.loadedCircle:
        if (stryMutAct_9fa48("4221")) {} else {
          stryCov_9fa48("4221");
          {
            if (stryMutAct_9fa48("4222")) {
              {}
            } else {
              stryCov_9fa48("4222");
              return stryMutAct_9fa48("4223") ? {} : (stryCov_9fa48("4223"), { ...state,
                item: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.loadedCirclesMetrics:
        if (stryMutAct_9fa48("4224")) {} else {
          stryCov_9fa48("4224");
          {
            if (stryMutAct_9fa48("4225")) {
              {}
            } else {
              stryCov_9fa48("4225");
              return stryMutAct_9fa48("4226") ? {} : (stryCov_9fa48("4226"), { ...state,
                metrics: action.payload
              });
            }
          }
        }

      case ACTION_TYPES.updateCircles:
        if (stryMutAct_9fa48("4227")) {} else {
          stryCov_9fa48("4227");
          {
            if (stryMutAct_9fa48("4228")) {
              {}
            } else {
              stryCov_9fa48("4228");
              const {
                payload
              } = action;
              const [newCircle] = payload;
              const content = map(state.list.content, circle => {
                if (stryMutAct_9fa48("4229")) {
                  {}
                } else {
                  stryCov_9fa48("4229");
                  return (stryMutAct_9fa48("4232") ? circle?.id !== newCircle?.id : stryMutAct_9fa48("4231") ? false : stryMutAct_9fa48("4230") ? true : (stryCov_9fa48("4230", "4231", "4232"), (stryMutAct_9fa48("4233") ? circle.id : (stryCov_9fa48("4233"), circle?.id)) === (stryMutAct_9fa48("4234") ? newCircle.id : (stryCov_9fa48("4234"), newCircle?.id)))) ? newCircle : circle;
                }
              });
              return stryMutAct_9fa48("4235") ? {} : (stryCov_9fa48("4235"), { ...state,
                list: stryMutAct_9fa48("4236") ? {} : (stryCov_9fa48("4236"), { ...state.list,
                  content
                })
              });
            }
          }
        }

      case ACTION_TYPES.resetContent:
        if (stryMutAct_9fa48("4237")) {} else {
          stryCov_9fa48("4237");
          {
            if (stryMutAct_9fa48("4238")) {
              {}
            } else {
              stryCov_9fa48("4238");
              return stryMutAct_9fa48("4239") ? {} : (stryCov_9fa48("4239"), { ...state,
                list: stryMutAct_9fa48("4240") ? {} : (stryCov_9fa48("4240"), { ...state.list,
                  content: stryMutAct_9fa48("4241") ? ["Stryker was here"] : (stryCov_9fa48("4241"), [])
                })
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("4242")) {} else {
          stryCov_9fa48("4242");
          {
            if (stryMutAct_9fa48("4243")) {
              {}
            } else {
              stryCov_9fa48("4243");
              return state;
            }
          }
        }

    }
  }
};