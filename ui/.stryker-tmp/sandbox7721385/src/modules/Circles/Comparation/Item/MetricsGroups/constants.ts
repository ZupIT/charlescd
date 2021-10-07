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

import { MetricFilter } from './types';
export const conditionOptions = stryMutAct_9fa48("3149") ? [] : (stryCov_9fa48("3149"), [stryMutAct_9fa48("3150") ? {} : (stryCov_9fa48("3150"), {
  value: stryMutAct_9fa48("3151") ? "" : (stryCov_9fa48("3151"), 'EQUAL'),
  label: stryMutAct_9fa48("3152") ? "" : (stryCov_9fa48("3152"), 'Equal')
}), stryMutAct_9fa48("3153") ? {} : (stryCov_9fa48("3153"), {
  value: stryMutAct_9fa48("3154") ? "" : (stryCov_9fa48("3154"), 'GREATER_THAN'),
  label: stryMutAct_9fa48("3155") ? "" : (stryCov_9fa48("3155"), 'Greater than')
}), stryMutAct_9fa48("3156") ? {} : (stryCov_9fa48("3156"), {
  value: stryMutAct_9fa48("3157") ? "" : (stryCov_9fa48("3157"), 'LOWER_THAN'),
  label: stryMutAct_9fa48("3158") ? "" : (stryCov_9fa48("3158"), 'Lower than')
})]);
export const operatorsOptions = stryMutAct_9fa48("3159") ? [] : (stryCov_9fa48("3159"), [stryMutAct_9fa48("3160") ? {} : (stryCov_9fa48("3160"), {
  value: stryMutAct_9fa48("3161") ? "" : (stryCov_9fa48("3161"), '='),
  label: stryMutAct_9fa48("3162") ? "" : (stryCov_9fa48("3162"), 'Equal')
}), stryMutAct_9fa48("3163") ? {} : (stryCov_9fa48("3163"), {
  value: stryMutAct_9fa48("3164") ? "" : (stryCov_9fa48("3164"), '!='),
  label: stryMutAct_9fa48("3165") ? "" : (stryCov_9fa48("3165"), 'Different')
}), stryMutAct_9fa48("3166") ? {} : (stryCov_9fa48("3166"), {
  value: stryMutAct_9fa48("3167") ? "" : (stryCov_9fa48("3167"), '!~'),
  label: stryMutAct_9fa48("3168") ? "" : (stryCov_9fa48("3168"), 'Regex')
})]);
export const FILTER: MetricFilter = stryMutAct_9fa48("3169") ? {} : (stryCov_9fa48("3169"), {
  field: stryMutAct_9fa48("3170") ? "Stryker was here!" : (stryCov_9fa48("3170"), ''),
  operator: stryMutAct_9fa48("3171") ? "Stryker was here!" : (stryCov_9fa48("3171"), ''),
  value: stryMutAct_9fa48("3172") ? "Stryker was here!" : (stryCov_9fa48("3172"), '')
});
export const defaultFilterValues = stryMutAct_9fa48("3173") ? [] : (stryCov_9fa48("3173"), [FILTER]);