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

export const MODULE = stryMutAct_9fa48("2457") ? {} : (stryCov_9fa48("2457"), {
  "id": stryMutAct_9fa48("2458") ? "" : (stryCov_9fa48("2458"), "123"),
  "name": stryMutAct_9fa48("2459") ? "" : (stryCov_9fa48("2459"), "module 1"),
  "gitRepositoryAddress": stryMutAct_9fa48("2460") ? "" : (stryCov_9fa48("2460"), "https://github.com/example"),
  "helmRepository": stryMutAct_9fa48("2461") ? "" : (stryCov_9fa48("2461"), "undefined/api/v4/projects/undefined/repository?ref=main"),
  "createdAt": stryMutAct_9fa48("2462") ? "" : (stryCov_9fa48("2462"), "2021-02-03 11:34:51"),
  "components": stryMutAct_9fa48("2463") ? [] : (stryCov_9fa48("2463"), [stryMutAct_9fa48("2464") ? {} : (stryCov_9fa48("2464"), {
    "id": stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), "456"),
    "name": stryMutAct_9fa48("2466") ? "" : (stryCov_9fa48("2466"), "component 1"),
    "createdAt": stryMutAct_9fa48("2467") ? "" : (stryCov_9fa48("2467"), "2021-02-03 11:34:51"),
    "errorThreshold": 10,
    "latencyThreshold": 5
  })])
});
export const MODULES = stryMutAct_9fa48("2468") ? {} : (stryCov_9fa48("2468"), {
  "content": stryMutAct_9fa48("2469") ? [] : (stryCov_9fa48("2469"), [stryMutAct_9fa48("2470") ? {} : (stryCov_9fa48("2470"), {
    "id": stryMutAct_9fa48("2471") ? "" : (stryCov_9fa48("2471"), "123"),
    "name": stryMutAct_9fa48("2472") ? "" : (stryCov_9fa48("2472"), "module 1"),
    "gitRepositoryAddress": stryMutAct_9fa48("2473") ? "" : (stryCov_9fa48("2473"), "https://github.com/example"),
    "helmRepository": stryMutAct_9fa48("2474") ? "" : (stryCov_9fa48("2474"), "undefined/api/v4/projects/undefined/repository?ref=main"),
    "createdAt": stryMutAct_9fa48("2475") ? "" : (stryCov_9fa48("2475"), "2021-02-03 11:34:51"),
    "components": stryMutAct_9fa48("2476") ? [] : (stryCov_9fa48("2476"), [stryMutAct_9fa48("2477") ? {} : (stryCov_9fa48("2477"), {
      "id": stryMutAct_9fa48("2478") ? "" : (stryCov_9fa48("2478"), "456"),
      "name": stryMutAct_9fa48("2479") ? "" : (stryCov_9fa48("2479"), "component 1"),
      "createdAt": stryMutAct_9fa48("2480") ? "" : (stryCov_9fa48("2480"), "2021-02-03 11:34:51"),
      "errorThreshold": 10,
      "latencyThreshold": 5
    })])
  })]),
  "page": 0,
  "size": 5,
  "totalPages": 1,
  "last": stryMutAct_9fa48("2481") ? false : (stryCov_9fa48("2481"), true)
});