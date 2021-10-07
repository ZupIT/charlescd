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

import isUndefined from 'lodash/isUndefined';
export const moduleFormatterName = (name: string) => {
  if (stryMutAct_9fa48("5336")) {
    {}
  } else {
    stryCov_9fa48("5336");
    const [owner, module] = name.split(stryMutAct_9fa48("5337") ? "" : (stryCov_9fa48("5337"), '/'));
    return stryMutAct_9fa48("5340") ? module && owner : stryMutAct_9fa48("5339") ? false : stryMutAct_9fa48("5338") ? true : (stryCov_9fa48("5338", "5339", "5340"), module || owner);
  }
};
export const validName = (name: string) => {
  if (stryMutAct_9fa48("5341")) {
    {}
  } else {
    stryCov_9fa48("5341");

    if (stryMutAct_9fa48("5343") ? false : stryMutAct_9fa48("5342") ? true : (stryCov_9fa48("5342", "5343"), isUndefined(name))) {
      if (stryMutAct_9fa48("5344")) {
        {}
      } else {
        stryCov_9fa48("5344");
        return stryMutAct_9fa48("5345") ? true : (stryCov_9fa48("5345"), false);
      }
    }

    return stryMutAct_9fa48("5348") ? name?.replace(/\d/gi, '') === '' : stryMutAct_9fa48("5347") ? false : stryMutAct_9fa48("5346") ? true : (stryCov_9fa48("5346", "5347", "5348"), (stryMutAct_9fa48("5349") ? name.replace(/\d/gi, '') : (stryCov_9fa48("5349"), name?.replace(stryMutAct_9fa48("5350") ? /\D/gi : (stryCov_9fa48("5350"), /\d/gi), stryMutAct_9fa48("5351") ? "Stryker was here!" : (stryCov_9fa48("5351"), '')))) !== (stryMutAct_9fa48("5352") ? "Stryker was here!" : (stryCov_9fa48("5352"), '')));
  }
};