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

import { baseRequest, putRequest, postRequest, patchRequest } from './base';
import { Profile, NewUser } from 'modules/Users/interfaces/User';
import { CheckPassword } from 'modules/Account/interfaces/ChangePassword';
import { getWorkspaceId } from 'core/utils/workspace';
import { buildParams } from 'core/utils/query';
import { DEFAULT_PAGE_SIZE } from 'core/constants/request';
const endpoint = stryMutAct_9fa48("1876") ? "" : (stryCov_9fa48("1876"), '/moove/v2/users');
const endpointWorkspaces = stryMutAct_9fa48("1877") ? "" : (stryCov_9fa48("1877"), '/moove/v2/workspaces');
const v1Endpoint = stryMutAct_9fa48("1878") ? "" : (stryCov_9fa48("1878"), '/moove/users');
export interface UserFilter {
  id?: string;
  name?: string;
  email?: string;
  page?: number;
}
const initialUserFilter = stryMutAct_9fa48("1879") ? {} : (stryCov_9fa48("1879"), {
  name: stryMutAct_9fa48("1880") ? "Stryker was here!" : (stryCov_9fa48("1880"), ''),
  page: 0
});
export const findAllWorkspaceUsers = (filter: UserFilter = initialUserFilter) => {
  if (stryMutAct_9fa48("1881")) {
    {}
  } else {
    stryCov_9fa48("1881");
    const workspaceId = getWorkspaceId();
    const page = stryMutAct_9fa48("1882") ? "" : (stryCov_9fa48("1882"), '0');
    const size = stryMutAct_9fa48("1883") ? "" : (stryCov_9fa48("1883"), '100');
    const params = buildParams(stryMutAct_9fa48("1884") ? {} : (stryCov_9fa48("1884"), {
      size,
      page,
      ...filter
    }));
    return baseRequest(stryMutAct_9fa48("1885") ? `` : (stryCov_9fa48("1885"), `${endpointWorkspaces}/${workspaceId}/users?${params}`));
  }
};
export const findAllUsers = (filter: UserFilter = initialUserFilter) => {
  if (stryMutAct_9fa48("1886")) {
    {}
  } else {
    stryCov_9fa48("1886");
    const params = new URLSearchParams(stryMutAct_9fa48("1887") ? {} : (stryCov_9fa48("1887"), {
      size: stryMutAct_9fa48("1888") ? `` : (stryCov_9fa48("1888"), `${DEFAULT_PAGE_SIZE}`),
      page: stryMutAct_9fa48("1889") ? `` : (stryCov_9fa48("1889"), `${stryMutAct_9fa48("1890") ? filter.page && 0 : (stryCov_9fa48("1890"), filter.page ?? 0)}`)
    }));
    if (stryMutAct_9fa48("1893") ? filter.name : stryMutAct_9fa48("1892") ? false : stryMutAct_9fa48("1891") ? true : (stryCov_9fa48("1891", "1892", "1893"), filter?.name)) params.append(stryMutAct_9fa48("1894") ? "" : (stryCov_9fa48("1894"), 'name'), stryMutAct_9fa48("1895") ? filter.name : (stryCov_9fa48("1895"), filter?.name));
    if (stryMutAct_9fa48("1898") ? filter.email : stryMutAct_9fa48("1897") ? false : stryMutAct_9fa48("1896") ? true : (stryCov_9fa48("1896", "1897", "1898"), filter?.email)) params.append(stryMutAct_9fa48("1899") ? "" : (stryCov_9fa48("1899"), 'email'), stryMutAct_9fa48("1900") ? filter.email : (stryCov_9fa48("1900"), filter?.email));
    return baseRequest(stryMutAct_9fa48("1901") ? `` : (stryCov_9fa48("1901"), `${endpoint}?${params}`));
  }
};
export const findAll = () => {
  if (stryMutAct_9fa48("1902")) {
    {}
  } else {
    stryCov_9fa48("1902");
    const params = new URLSearchParams(stryMutAct_9fa48("1903") ? {} : (stryCov_9fa48("1903"), {
      size: stryMutAct_9fa48("1904") ? `` : (stryCov_9fa48("1904"), `${DEFAULT_PAGE_SIZE}`),
      page: stryMutAct_9fa48("1905") ? "" : (stryCov_9fa48("1905"), '0'),
      sort: stryMutAct_9fa48("1906") ? "" : (stryCov_9fa48("1906"), 'createdAt,desc')
    }));
    return baseRequest(stryMutAct_9fa48("1907") ? `` : (stryCov_9fa48("1907"), `${v1Endpoint}?${params}`));
  }
};
export const resetPasswordById = stryMutAct_9fa48("1908") ? () => undefined : (stryCov_9fa48("1908"), (() => {
  const resetPasswordById = (id: string) => putRequest(stryMutAct_9fa48("1909") ? `` : (stryCov_9fa48("1909"), `${endpoint}/${id}/reset-password`));

  return resetPasswordById;
})());
export const updateProfileById = stryMutAct_9fa48("1910") ? () => undefined : (stryCov_9fa48("1910"), (() => {
  const updateProfileById = (id: string, profile: Profile) => putRequest(stryMutAct_9fa48("1911") ? `` : (stryCov_9fa48("1911"), `${v1Endpoint}/${id}`), profile);

  return updateProfileById;
})());
export const patchProfileById = stryMutAct_9fa48("1912") ? () => undefined : (stryCov_9fa48("1912"), (() => {
  const patchProfileById = (id: string, name: string) => patchRequest(stryMutAct_9fa48("1913") ? `` : (stryCov_9fa48("1913"), `${endpoint}/${id}`), stryMutAct_9fa48("1914") ? "" : (stryCov_9fa48("1914"), 'replace'), stryMutAct_9fa48("1915") ? "" : (stryCov_9fa48("1915"), '/name'), name);

  return patchProfileById;
})());
export const findUserByEmail = (email: string) => {
  if (stryMutAct_9fa48("1916")) {
    {}
  } else {
    stryCov_9fa48("1916");
    const encodedEmail = btoa(email);
    return baseRequest(stryMutAct_9fa48("1917") ? `` : (stryCov_9fa48("1917"), `${endpoint}/${encodedEmail}`));
  }
};
export const findWorkspacesByUserId = (id: string, {
  name
}: {
  name: string;
}) => {
  if (stryMutAct_9fa48("1918")) {
    {}
  } else {
    stryCov_9fa48("1918");
    const params = new URLSearchParams(stryMutAct_9fa48("1919") ? {} : (stryCov_9fa48("1919"), {
      size: stryMutAct_9fa48("1920") ? `` : (stryCov_9fa48("1920"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1923") ? name && '' : stryMutAct_9fa48("1922") ? false : stryMutAct_9fa48("1921") ? true : (stryCov_9fa48("1921", "1922", "1923"), name || (stryMutAct_9fa48("1924") ? "Stryker was here!" : (stryCov_9fa48("1924"), ''))),
      page: stryMutAct_9fa48("1925") ? "" : (stryCov_9fa48("1925"), '0'),
      sort: stryMutAct_9fa48("1926") ? "" : (stryCov_9fa48("1926"), 'createdAt,desc')
    }));
    return baseRequest(stryMutAct_9fa48("1927") ? `` : (stryCov_9fa48("1927"), `${endpoint}/${id}/workspaces?${params}`));
  }
};
export const deleteUserById = stryMutAct_9fa48("1928") ? () => undefined : (stryCov_9fa48("1928"), (() => {
  const deleteUserById = (id: string) => baseRequest(stryMutAct_9fa48("1929") ? `` : (stryCov_9fa48("1929"), `${v1Endpoint}/${id}`), null, stryMutAct_9fa48("1930") ? {} : (stryCov_9fa48("1930"), {
    method: stryMutAct_9fa48("1931") ? "" : (stryCov_9fa48("1931"), 'DELETE')
  }));

  return deleteUserById;
})());
export const createNewUser = stryMutAct_9fa48("1932") ? () => undefined : (stryCov_9fa48("1932"), (() => {
  const createNewUser = (user: NewUser) => postRequest(stryMutAct_9fa48("1933") ? `` : (stryCov_9fa48("1933"), `${endpoint}`), user);

  return createNewUser;
})());
export const changePassword = stryMutAct_9fa48("1934") ? () => undefined : (stryCov_9fa48("1934"), (() => {
  const changePassword = (data: CheckPassword) => putRequest(stryMutAct_9fa48("1935") ? `` : (stryCov_9fa48("1935"), `${endpoint}/password`), data);

  return changePassword;
})());