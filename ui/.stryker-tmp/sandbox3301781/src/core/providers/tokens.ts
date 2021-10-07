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

import { DEFAULT_PAGE_SIZE } from 'core/constants/request';
import { Token } from 'modules/Tokens/interfaces';
import { baseRequest, postRequest, putRequest } from './base';
const endpoint = stryMutAct_9fa48("1809") ? "" : (stryCov_9fa48("1809"), '/gate/api/v1/system-token');
const initialModulesFilter: ModulesFilter = stryMutAct_9fa48("1810") ? {} : (stryCov_9fa48("1810"), {
  name: stryMutAct_9fa48("1811") ? "Stryker was here!" : (stryCov_9fa48("1811"), ''),
  page: 0
});
export interface ModulesFilter {
  name?: string;
  page?: number;
}
export const findAll = (filter: ModulesFilter = initialModulesFilter) => {
  if (stryMutAct_9fa48("1812")) {
    {}
  } else {
    stryCov_9fa48("1812");
    const params = new URLSearchParams(stryMutAct_9fa48("1813") ? {} : (stryCov_9fa48("1813"), {
      size: stryMutAct_9fa48("1814") ? `` : (stryCov_9fa48("1814"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1817") ? filter?.name && '' : stryMutAct_9fa48("1816") ? false : stryMutAct_9fa48("1815") ? true : (stryCov_9fa48("1815", "1816", "1817"), (stryMutAct_9fa48("1818") ? filter.name : (stryCov_9fa48("1818"), filter?.name)) || (stryMutAct_9fa48("1819") ? "Stryker was here!" : (stryCov_9fa48("1819"), ''))),
      page: stryMutAct_9fa48("1820") ? `` : (stryCov_9fa48("1820"), `${stryMutAct_9fa48("1821") ? filter.page && 0 : (stryCov_9fa48("1821"), filter.page ?? 0)}`)
    }));
    return baseRequest(stryMutAct_9fa48("1822") ? `` : (stryCov_9fa48("1822"), `${endpoint}?${params}`));
  }
};
export const findById = stryMutAct_9fa48("1823") ? () => undefined : (stryCov_9fa48("1823"), (() => {
  const findById = (id: string) => baseRequest(stryMutAct_9fa48("1824") ? `` : (stryCov_9fa48("1824"), `${endpoint}/${id}`));

  return findById;
})());
export const create = stryMutAct_9fa48("1825") ? () => undefined : (stryCov_9fa48("1825"), (() => {
  const create = (token: Token) => postRequest(endpoint, token);

  return create;
})());
export const revoke = stryMutAct_9fa48("1826") ? () => undefined : (stryCov_9fa48("1826"), (() => {
  const revoke = (id: string) => postRequest(stryMutAct_9fa48("1827") ? `` : (stryCov_9fa48("1827"), `${endpoint}/${id}/revoke`));

  return revoke;
})());
export const regenerate = stryMutAct_9fa48("1828") ? () => undefined : (stryCov_9fa48("1828"), (() => {
  const regenerate = (id: string) => putRequest(stryMutAct_9fa48("1829") ? `` : (stryCov_9fa48("1829"), `${endpoint}/${id}/regenerate`));

  return regenerate;
})());