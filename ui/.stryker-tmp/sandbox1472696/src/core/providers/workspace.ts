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

import { baseRequest, patchRequest } from './base';
import { getWorkspaceId } from 'core/utils/workspace';
import { DEFAULT_PAGE_SIZE } from 'core/constants/request';
export const mooveEndpoint = stryMutAct_9fa48("1947") ? "" : (stryCov_9fa48("1947"), '/moove/v2');
export const endpoint = stryMutAct_9fa48("1948") ? `` : (stryCov_9fa48("1948"), `${mooveEndpoint}/workspaces`);
export interface Patch {
  op: string;
  path: string;
  value: string;
}
export interface Filter {
  id?: string;
  name?: string;
  page?: number;
}
export interface WorkspaceSave {
  name: string;
}
export type GitConnectionTest = {
  credentials: {
    address: string;
    accessToken: string;
    serviceProvider: string;
  };
};
const initialFilter = stryMutAct_9fa48("1949") ? {} : (stryCov_9fa48("1949"), {
  name: stryMutAct_9fa48("1950") ? "Stryker was here!" : (stryCov_9fa48("1950"), ''),
  page: 0
});
export const findAll = (filter: Filter = initialFilter) => {
  if (stryMutAct_9fa48("1951")) {
    {}
  } else {
    stryCov_9fa48("1951");
    const params = new URLSearchParams(stryMutAct_9fa48("1952") ? {} : (stryCov_9fa48("1952"), {
      size: stryMutAct_9fa48("1953") ? `` : (stryCov_9fa48("1953"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1956") ? filter?.name && '' : stryMutAct_9fa48("1955") ? false : stryMutAct_9fa48("1954") ? true : (stryCov_9fa48("1954", "1955", "1956"), (stryMutAct_9fa48("1957") ? filter.name : (stryCov_9fa48("1957"), filter?.name)) || (stryMutAct_9fa48("1958") ? "Stryker was here!" : (stryCov_9fa48("1958"), ''))),
      page: stryMutAct_9fa48("1959") ? `` : (stryCov_9fa48("1959"), `${stryMutAct_9fa48("1960") ? filter.page && 0 : (stryCov_9fa48("1960"), filter.page ?? 0)}`)
    }));
    return baseRequest(stryMutAct_9fa48("1961") ? `` : (stryCov_9fa48("1961"), `${endpoint}?${params}`));
  }
};
export const saveWorkspaceName = stryMutAct_9fa48("1962") ? () => undefined : (stryCov_9fa48("1962"), (() => {
  const saveWorkspaceName = (data: WorkspaceSave) => baseRequest(stryMutAct_9fa48("1963") ? `` : (stryCov_9fa48("1963"), `${endpoint}`), data, stryMutAct_9fa48("1964") ? {} : (stryCov_9fa48("1964"), {
    method: stryMutAct_9fa48("1965") ? "" : (stryCov_9fa48("1965"), 'POST')
  }));

  return saveWorkspaceName;
})());
export const findById = stryMutAct_9fa48("1966") ? () => undefined : (stryCov_9fa48("1966"), (() => {
  const findById = (filter: Filter) => baseRequest(stryMutAct_9fa48("1967") ? `` : (stryCov_9fa48("1967"), `${endpoint}/${stryMutAct_9fa48("1968") ? filter.id : (stryCov_9fa48("1968"), filter?.id)}`));

  return findById;
})());
export const updateName = stryMutAct_9fa48("1969") ? () => undefined : (stryCov_9fa48("1969"), (() => {
  const updateName = (value: string) => patchRequest(stryMutAct_9fa48("1970") ? `` : (stryCov_9fa48("1970"), `${endpoint}/${getWorkspaceId()}`), stryMutAct_9fa48("1971") ? "" : (stryCov_9fa48("1971"), 'replace'), stryMutAct_9fa48("1972") ? "" : (stryCov_9fa48("1972"), '/name'), value);

  return updateName;
})());
export const addConfig = stryMutAct_9fa48("1973") ? () => undefined : (stryCov_9fa48("1973"), (() => {
  const addConfig = (path: string, value: string) => patchRequest(stryMutAct_9fa48("1974") ? `` : (stryCov_9fa48("1974"), `${endpoint}/${getWorkspaceId()}`), stryMutAct_9fa48("1975") ? "" : (stryCov_9fa48("1975"), 'replace'), path, value);

  return addConfig;
})());
export const delConfig = stryMutAct_9fa48("1976") ? () => undefined : (stryCov_9fa48("1976"), (() => {
  const delConfig = (path: string, value: string) => patchRequest(stryMutAct_9fa48("1977") ? `` : (stryCov_9fa48("1977"), `${endpoint}/${getWorkspaceId()}`), stryMutAct_9fa48("1978") ? "" : (stryCov_9fa48("1978"), 'remove'), path, value);

  return delConfig;
})());
export const testGitConnection = stryMutAct_9fa48("1979") ? () => undefined : (stryCov_9fa48("1979"), (() => {
  const testGitConnection = (data: GitConnectionTest) => baseRequest(stryMutAct_9fa48("1980") ? `` : (stryCov_9fa48("1980"), `${mooveEndpoint}/configurations/git/connection-status`), data, stryMutAct_9fa48("1981") ? {} : (stryCov_9fa48("1981"), {
    method: stryMutAct_9fa48("1982") ? "" : (stryCov_9fa48("1982"), 'POST')
  }));

  return testGitConnection;
})());