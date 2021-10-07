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
import { baseRequest } from './base';
const endpoint = stryMutAct_9fa48("1830") ? "" : (stryCov_9fa48("1830"), '/moove/v2/user-groups');
export interface UserGroupFilter {
  name?: string;
  page?: number;
}
export interface UserGroupSave {
  name: string;
}
export interface UserGroupMemberSave {
  memberId: string;
}
const initialGroupUserFilter = stryMutAct_9fa48("1831") ? {} : (stryCov_9fa48("1831"), {
  name: stryMutAct_9fa48("1832") ? "Stryker was here!" : (stryCov_9fa48("1832"), ''),
  page: 0
});
export const findAllUserGroup = (filter: UserGroupFilter = initialGroupUserFilter) => {
  if (stryMutAct_9fa48("1833")) {
    {}
  } else {
    stryCov_9fa48("1833");
    const params = new URLSearchParams(stryMutAct_9fa48("1834") ? {} : (stryCov_9fa48("1834"), {
      size: stryMutAct_9fa48("1835") ? `` : (stryCov_9fa48("1835"), `${DEFAULT_PAGE_SIZE}`),
      name: stryMutAct_9fa48("1838") ? filter?.name && '' : stryMutAct_9fa48("1837") ? false : stryMutAct_9fa48("1836") ? true : (stryCov_9fa48("1836", "1837", "1838"), (stryMutAct_9fa48("1839") ? filter.name : (stryCov_9fa48("1839"), filter?.name)) || (stryMutAct_9fa48("1840") ? "Stryker was here!" : (stryCov_9fa48("1840"), ''))),
      page: stryMutAct_9fa48("1841") ? `` : (stryCov_9fa48("1841"), `${stryMutAct_9fa48("1842") ? filter.page && 0 : (stryCov_9fa48("1842"), filter.page ?? 0)}`)
    }));
    return baseRequest(stryMutAct_9fa48("1843") ? `` : (stryCov_9fa48("1843"), `${endpoint}?${params}`));
  }
};
export const findUserGroupById = stryMutAct_9fa48("1844") ? () => undefined : (stryCov_9fa48("1844"), (() => {
  const findUserGroupById = (id: string) => baseRequest(stryMutAct_9fa48("1845") ? `` : (stryCov_9fa48("1845"), `${endpoint}/${id}`));

  return findUserGroupById;
})());
export const saveUserGroup = stryMutAct_9fa48("1846") ? () => undefined : (stryCov_9fa48("1846"), (() => {
  const saveUserGroup = (data: UserGroupSave) => baseRequest(stryMutAct_9fa48("1847") ? `` : (stryCov_9fa48("1847"), `${endpoint}`), data, stryMutAct_9fa48("1848") ? {} : (stryCov_9fa48("1848"), {
    method: stryMutAct_9fa48("1849") ? "" : (stryCov_9fa48("1849"), 'POST')
  }));

  return saveUserGroup;
})());
export const updateUserGroup = stryMutAct_9fa48("1850") ? () => undefined : (stryCov_9fa48("1850"), (() => {
  const updateUserGroup = (id: string, data: UserGroupSave) => baseRequest(stryMutAct_9fa48("1851") ? `` : (stryCov_9fa48("1851"), `${endpoint}/${id}`), data, stryMutAct_9fa48("1852") ? {} : (stryCov_9fa48("1852"), {
    method: stryMutAct_9fa48("1853") ? "" : (stryCov_9fa48("1853"), 'PUT')
  }));

  return updateUserGroup;
})());
export const deleteUserGroup = stryMutAct_9fa48("1854") ? () => undefined : (stryCov_9fa48("1854"), (() => {
  const deleteUserGroup = (id: string) => baseRequest(stryMutAct_9fa48("1855") ? `` : (stryCov_9fa48("1855"), `${endpoint}/${id}`), null, stryMutAct_9fa48("1856") ? {} : (stryCov_9fa48("1856"), {
    method: stryMutAct_9fa48("1857") ? "" : (stryCov_9fa48("1857"), 'DELETE')
  }));

  return deleteUserGroup;
})());
export const addMemberToUserGroup = stryMutAct_9fa48("1858") ? () => undefined : (stryCov_9fa48("1858"), (() => {
  const addMemberToUserGroup = (id: string, data: UserGroupMemberSave) => baseRequest(stryMutAct_9fa48("1859") ? `` : (stryCov_9fa48("1859"), `${endpoint}/${id}/members`), data, stryMutAct_9fa48("1860") ? {} : (stryCov_9fa48("1860"), {
    method: stryMutAct_9fa48("1861") ? "" : (stryCov_9fa48("1861"), 'POST')
  }));

  return addMemberToUserGroup;
})());
export const removeMemberToUserGroup = stryMutAct_9fa48("1862") ? () => undefined : (stryCov_9fa48("1862"), (() => {
  const removeMemberToUserGroup = (userGroupId: string, memberId: string) => baseRequest(stryMutAct_9fa48("1863") ? `` : (stryCov_9fa48("1863"), `${endpoint}/${userGroupId}/members/${memberId}`), null, stryMutAct_9fa48("1864") ? {} : (stryCov_9fa48("1864"), {
    method: stryMutAct_9fa48("1865") ? "" : (stryCov_9fa48("1865"), 'DELETE')
  }));

  return removeMemberToUserGroup;
})());