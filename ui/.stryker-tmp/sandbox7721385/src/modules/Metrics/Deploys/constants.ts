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

import { PERIOD_PARAM } from './interfaces';
export const periodFilterItems = stryMutAct_9fa48("4915") ? [] : (stryCov_9fa48("4915"), [stryMutAct_9fa48("4916") ? {} : (stryCov_9fa48("4916"), {
  label: stryMutAct_9fa48("4917") ? "" : (stryCov_9fa48("4917"), 'One week'),
  value: PERIOD_PARAM.ONE_WEEK
}), stryMutAct_9fa48("4918") ? {} : (stryCov_9fa48("4918"), {
  label: stryMutAct_9fa48("4919") ? "" : (stryCov_9fa48("4919"), 'Two weeks'),
  value: PERIOD_PARAM.TWO_WEEKS
}), stryMutAct_9fa48("4920") ? {} : (stryCov_9fa48("4920"), {
  label: stryMutAct_9fa48("4921") ? "" : (stryCov_9fa48("4921"), 'One month'),
  value: PERIOD_PARAM.ONE_MONTH
}), stryMutAct_9fa48("4922") ? {} : (stryCov_9fa48("4922"), {
  label: stryMutAct_9fa48("4923") ? "" : (stryCov_9fa48("4923"), 'Three monts'),
  value: PERIOD_PARAM.THREE_MONTHS
})]);