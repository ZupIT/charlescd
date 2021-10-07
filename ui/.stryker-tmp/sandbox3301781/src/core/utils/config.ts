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

const configKey = stryMutAct_9fa48("2093") ? "" : (stryCov_9fa48("2093"), 'config');
export const getConfig = () => {
  if (stryMutAct_9fa48("2094")) {
    {}
  } else {
    stryCov_9fa48("2094");

    try {
      if (stryMutAct_9fa48("2095")) {
        {}
      } else {
        stryCov_9fa48("2095");
        return JSON.parse(atob(localStorage.getItem(configKey)));
      }
    } catch (e) {
      if (stryMutAct_9fa48("2096")) {
        {}
      } else {
        stryCov_9fa48("2096");
        return {};
      }
    }
  }
};
export const getConfigByKey = (key: string) => {
  if (stryMutAct_9fa48("2097")) {
    {}
  } else {
    stryCov_9fa48("2097");
    const config = getConfig();
    return stryMutAct_9fa48("2098") ? config[key] : (stryCov_9fa48("2098"), config?.[key]);
  }
};
export const setConfig = (key: string, value: unknown) => {
  if (stryMutAct_9fa48("2099")) {
    {}
  } else {
    stryCov_9fa48("2099");
    const config = stryMutAct_9fa48("2102") ? getConfig() && {} : stryMutAct_9fa48("2101") ? false : stryMutAct_9fa48("2100") ? true : (stryCov_9fa48("2100", "2101", "2102"), getConfig() || {});
    localStorage.setItem(configKey, btoa(JSON.stringify(stryMutAct_9fa48("2103") ? {} : (stryCov_9fa48("2103"), { ...config,
      [key]: value
    }))));
  }
};