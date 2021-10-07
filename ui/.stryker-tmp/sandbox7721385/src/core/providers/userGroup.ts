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

import { GroupRoles } from 'modules/Settings/Credentials/Sections/UserGroup/interfaces';
import { baseRequest, postRequest, deleteRequest } from './base';
import { endpoint as endpointWorkspace } from './workspace';
const endpoint = stryMutAct_9fa48("1866") ? "" : (stryCov_9fa48("1866"), '/moove/v2/user-groups');
const groupPath = stryMutAct_9fa48("1867") ? "" : (stryCov_9fa48("1867"), 'groups');
export const findAll = stryMutAct_9fa48("1868") ? () => undefined : (stryCov_9fa48("1868"), (() => {
  const findAll = () => baseRequest(stryMutAct_9fa48("1869") ? `` : (stryCov_9fa48("1869"), `${endpoint}`));

  return findAll;
})());
export const findByName = stryMutAct_9fa48("1870") ? () => undefined : (stryCov_9fa48("1870"), (() => {
  const findByName = (name: string) => baseRequest(stryMutAct_9fa48("1871") ? `` : (stryCov_9fa48("1871"), `${endpoint}?name=${name}`));

  return findByName;
})());
export const create = stryMutAct_9fa48("1872") ? () => undefined : (stryCov_9fa48("1872"), (() => {
  const create = (id: string, groupRoles: GroupRoles) => postRequest(stryMutAct_9fa48("1873") ? `` : (stryCov_9fa48("1873"), `${endpointWorkspace}/${id}/${groupPath}`), groupRoles);

  return create;
})());
export const detach = stryMutAct_9fa48("1874") ? () => undefined : (stryCov_9fa48("1874"), (() => {
  const detach = (id: string, groupId: string) => deleteRequest(stryMutAct_9fa48("1875") ? `` : (stryCov_9fa48("1875"), `${endpointWorkspace}/${id}/${groupPath}/${groupId}`));

  return detach;
})());