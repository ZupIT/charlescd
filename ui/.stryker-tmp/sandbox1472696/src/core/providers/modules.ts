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

import { DEFAULT_PAGE_SIZE } from 'core/constants/request';
import { buildParams, URLParams } from 'core/utils/query';
import { baseRequest, postRequest } from './base';
const endpoint = stryMutAct_9fa48("1757") ? "" : (stryCov_9fa48("1757"), '/moove/v2/modules');
export interface Component {
  name: string;
  errorThreshold: number;
  latencyThreshold: number;
}
export interface ModuleSave {
  name: string;
  helmRepository: string;
  gitRepositoryAddress: string;
  components: Component[];
}
const initialModulesFilter: ModulesFilter = stryMutAct_9fa48("1758") ? {} : (stryCov_9fa48("1758"), {
  name: stryMutAct_9fa48("1759") ? "Stryker was here!" : (stryCov_9fa48("1759"), ''),
  page: 0
});
export interface ModulesFilter {
  name?: string;
  page?: number;
}
export const findAll = (filter: ModulesFilter = initialModulesFilter) => {
  if (stryMutAct_9fa48("1760")) {
    {}
  } else {
    stryCov_9fa48("1760");
    const params = new URLSearchParams(stryMutAct_9fa48("1761") ? {} : (stryCov_9fa48("1761"), {
      size: stryMutAct_9fa48("1762") ? `` : (stryCov_9fa48("1762"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1765") ? filter?.name && '' : stryMutAct_9fa48("1764") ? false : stryMutAct_9fa48("1763") ? true : (stryCov_9fa48("1763", "1764", "1765"), (stryMutAct_9fa48("1766") ? filter.name : (stryCov_9fa48("1766"), filter?.name)) || (stryMutAct_9fa48("1767") ? "Stryker was here!" : (stryCov_9fa48("1767"), ''))),
      page: stryMutAct_9fa48("1768") ? `` : (stryCov_9fa48("1768"), `${stryMutAct_9fa48("1769") ? filter.page && 0 : (stryCov_9fa48("1769"), filter.page ?? 0)}`)
    }));
    return baseRequest(stryMutAct_9fa48("1770") ? `` : (stryCov_9fa48("1770"), `${endpoint}?${params}`));
  }
};
export const findById = stryMutAct_9fa48("1771") ? () => undefined : (stryCov_9fa48("1771"), (() => {
  const findById = (id: string) => baseRequest(stryMutAct_9fa48("1772") ? `` : (stryCov_9fa48("1772"), `${endpoint}/${id}`));

  return findById;
})());
export const create = stryMutAct_9fa48("1773") ? () => undefined : (stryCov_9fa48("1773"), (() => {
  const create = (module: ModuleSave) => postRequest(stryMutAct_9fa48("1774") ? `` : (stryCov_9fa48("1774"), `${endpoint}`), module);

  return create;
})());
export const update = stryMutAct_9fa48("1775") ? () => undefined : (stryCov_9fa48("1775"), (() => {
  const update = (id: string, module: ModuleSave) => baseRequest(stryMutAct_9fa48("1776") ? `` : (stryCov_9fa48("1776"), `${endpoint}/${id}`), module, stryMutAct_9fa48("1777") ? {} : (stryCov_9fa48("1777"), {
    method: stryMutAct_9fa48("1778") ? "" : (stryCov_9fa48("1778"), 'PUT')
  }));

  return update;
})());
export const deleteModule = stryMutAct_9fa48("1779") ? () => undefined : (stryCov_9fa48("1779"), (() => {
  const deleteModule = (id: string) => baseRequest(stryMutAct_9fa48("1780") ? `` : (stryCov_9fa48("1780"), `${endpoint}/${id}`), {}, stryMutAct_9fa48("1781") ? {} : (stryCov_9fa48("1781"), {
    method: stryMutAct_9fa48("1782") ? "" : (stryCov_9fa48("1782"), 'DELETE')
  }));

  return deleteModule;
})());
export const createComponent = stryMutAct_9fa48("1783") ? () => undefined : (stryCov_9fa48("1783"), (() => {
  const createComponent = (moduleId: string, component: Component) => baseRequest(stryMutAct_9fa48("1784") ? `` : (stryCov_9fa48("1784"), `${endpoint}/${moduleId}/components`), component, stryMutAct_9fa48("1785") ? {} : (stryCov_9fa48("1785"), {
    method: stryMutAct_9fa48("1786") ? "" : (stryCov_9fa48("1786"), 'POST')
  }));

  return createComponent;
})());
export const updateComponent = stryMutAct_9fa48("1787") ? () => undefined : (stryCov_9fa48("1787"), (() => {
  const updateComponent = (moduleId: string, componentId: string, component: Component) => baseRequest(stryMutAct_9fa48("1788") ? `` : (stryCov_9fa48("1788"), `${endpoint}/${moduleId}/components/${componentId}`), component, stryMutAct_9fa48("1789") ? {} : (stryCov_9fa48("1789"), {
    method: stryMutAct_9fa48("1790") ? "" : (stryCov_9fa48("1790"), 'PUT')
  }));

  return updateComponent;
})());
export const deleteComponent = stryMutAct_9fa48("1791") ? () => undefined : (stryCov_9fa48("1791"), (() => {
  const deleteComponent = (moduleId: string, componentId: string) => baseRequest(stryMutAct_9fa48("1792") ? `` : (stryCov_9fa48("1792"), `${endpoint}/${moduleId}/components/${componentId}`), {}, stryMutAct_9fa48("1793") ? {} : (stryCov_9fa48("1793"), {
    method: stryMutAct_9fa48("1794") ? "" : (stryCov_9fa48("1794"), 'DELETE')
  }));

  return deleteComponent;
})());
export const findComponentTags = stryMutAct_9fa48("1795") ? () => undefined : (stryCov_9fa48("1795"), (() => {
  const findComponentTags = (moduleId: string, componentId: string, params: URLParams) => baseRequest(stryMutAct_9fa48("1796") ? `` : (stryCov_9fa48("1796"), `${endpoint}/${moduleId}/components/${componentId}/tags?${buildParams(params)}`));

  return findComponentTags;
})());