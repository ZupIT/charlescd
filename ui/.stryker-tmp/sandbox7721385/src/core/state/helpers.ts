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

import get from 'lodash/get';
import { State } from './interfaces/State';
import { Reducer } from './interfaces/Reducer';
import { RootActionTypes } from '.';
export const combineReducer = (reducers: Reducer) => {
  if (stryMutAct_9fa48("1983")) {
    {}
  } else {
    stryCov_9fa48("1983");
    const reducerKeys = Object.keys(reducers);
    return (state: State, action: RootActionTypes) => {
      if (stryMutAct_9fa48("1984")) {
        {}
      } else {
        stryCov_9fa48("1984");
        let nextState = state;
        reducerKeys.map(key => {
          if (stryMutAct_9fa48("1985")) {
            {}
          } else {
            stryCov_9fa48("1985");
            const reducer = get(reducers, key);
            const previousStateForKey = get(state, key);
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState = stryMutAct_9fa48("1986") ? {} : (stryCov_9fa48("1986"), { ...nextState,
              [key]: nextStateForKey
            });
            return key;
          }
        });
        return nextState;
      }
    };
  }
};