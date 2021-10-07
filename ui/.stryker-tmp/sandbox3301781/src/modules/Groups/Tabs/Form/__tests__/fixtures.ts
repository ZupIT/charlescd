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

import { UserGroup } from 'modules/Groups/interfaces/UserGroups';
export const mockUserGroup1: UserGroup = stryMutAct_9fa48("4286") ? {} : (stryCov_9fa48("4286"), {
  id: stryMutAct_9fa48("4287") ? "" : (stryCov_9fa48("4287"), '123'),
  name: stryMutAct_9fa48("4288") ? "" : (stryCov_9fa48("4288"), 'User Group 1'),
  users: stryMutAct_9fa48("4289") ? [] : (stryCov_9fa48("4289"), [stryMutAct_9fa48("4290") ? {} : (stryCov_9fa48("4290"), {
    id: stryMutAct_9fa48("4291") ? "" : (stryCov_9fa48("4291"), 'c7e6dete-aa7a-4216-be1b-34eaqd4c2915'),
    name: stryMutAct_9fa48("4292") ? "" : (stryCov_9fa48("4292"), 'User 1'),
    email: stryMutAct_9fa48("4293") ? "" : (stryCov_9fa48("4293"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4294") ? {} : (stryCov_9fa48("4294"), {
    id: stryMutAct_9fa48("4295") ? "" : (stryCov_9fa48("4295"), 'a7c3e4b6-4be3-4d62-8140-e2d34214e03f'),
    name: stryMutAct_9fa48("4296") ? "" : (stryCov_9fa48("4296"), 'User 2'),
    email: stryMutAct_9fa48("4297") ? "" : (stryCov_9fa48("4297"), 'darwin@charles.io')
  })])
});
export const mockUserGroup2: UserGroup = stryMutAct_9fa48("4298") ? {} : (stryCov_9fa48("4298"), {
  id: stryMutAct_9fa48("4299") ? "" : (stryCov_9fa48("4299"), '456'),
  name: stryMutAct_9fa48("4300") ? "" : (stryCov_9fa48("4300"), 'User Group 2'),
  users: stryMutAct_9fa48("4301") ? [] : (stryCov_9fa48("4301"), [stryMutAct_9fa48("4302") ? {} : (stryCov_9fa48("4302"), {
    id: stryMutAct_9fa48("4303") ? "" : (stryCov_9fa48("4303"), 'c7e6dete-aa7a-4216-be1b-34eaqd4c2915'),
    name: stryMutAct_9fa48("4304") ? "" : (stryCov_9fa48("4304"), 'User 1'),
    email: stryMutAct_9fa48("4305") ? "" : (stryCov_9fa48("4305"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4306") ? {} : (stryCov_9fa48("4306"), {
    id: stryMutAct_9fa48("4307") ? "" : (stryCov_9fa48("4307"), 'a7c3e4b6-4be3-4d62-8140-e2d34214e03f'),
    name: stryMutAct_9fa48("4308") ? "" : (stryCov_9fa48("4308"), 'User 2'),
    email: stryMutAct_9fa48("4309") ? "" : (stryCov_9fa48("4309"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4310") ? {} : (stryCov_9fa48("4310"), {
    id: stryMutAct_9fa48("4311") ? "" : (stryCov_9fa48("4311"), '13ea193b-f9d2-4wed-b1ce-471a7aqa71c2'),
    name: stryMutAct_9fa48("4312") ? "" : (stryCov_9fa48("4312"), 'User 3'),
    email: stryMutAct_9fa48("4313") ? "" : (stryCov_9fa48("4313"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4314") ? {} : (stryCov_9fa48("4314"), {
    id: stryMutAct_9fa48("4315") ? "" : (stryCov_9fa48("4315"), 'a7c3e4b6-4ce3-1d62-8140-e2d23214e03f'),
    name: stryMutAct_9fa48("4316") ? "" : (stryCov_9fa48("4316"), 'User 4'),
    email: stryMutAct_9fa48("4317") ? "" : (stryCov_9fa48("4317"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4318") ? {} : (stryCov_9fa48("4318"), {
    id: stryMutAct_9fa48("4319") ? "" : (stryCov_9fa48("4319"), 'a7c3e4b6-4233-4d62-8140-e1ad23214e03f'),
    name: stryMutAct_9fa48("4320") ? "" : (stryCov_9fa48("4320"), 'User 5'),
    email: stryMutAct_9fa48("4321") ? "" : (stryCov_9fa48("4321"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4322") ? {} : (stryCov_9fa48("4322"), {
    id: stryMutAct_9fa48("4323") ? "" : (stryCov_9fa48("4323"), 'jns6e4b6-4be3-4d62-8140-e2d23214e03f'),
    name: stryMutAct_9fa48("4324") ? "" : (stryCov_9fa48("4324"), 'User 6'),
    email: stryMutAct_9fa48("4325") ? "" : (stryCov_9fa48("4325"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4326") ? {} : (stryCov_9fa48("4326"), {
    id: stryMutAct_9fa48("4327") ? "" : (stryCov_9fa48("4327"), 'a7uj16b6-4be3-4d62-8140-e2d23214e03f'),
    name: stryMutAct_9fa48("4328") ? "" : (stryCov_9fa48("4328"), 'User 7'),
    email: stryMutAct_9fa48("4329") ? "" : (stryCov_9fa48("4329"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4330") ? {} : (stryCov_9fa48("4330"), {
    id: stryMutAct_9fa48("4331") ? "" : (stryCov_9fa48("4331"), 'a7c3e4b6-4be3-4d62-8140-e2d2ok14e03f'),
    name: stryMutAct_9fa48("4332") ? "" : (stryCov_9fa48("4332"), 'User 8'),
    email: stryMutAct_9fa48("4333") ? "" : (stryCov_9fa48("4333"), 'darwin@charles.io')
  }), stryMutAct_9fa48("4334") ? {} : (stryCov_9fa48("4334"), {
    id: stryMutAct_9fa48("4335") ? "" : (stryCov_9fa48("4335"), 'a7cop9b6-4be3-4d62-8140-e2d23214e03f'),
    name: stryMutAct_9fa48("4336") ? "" : (stryCov_9fa48("4336"), 'User 9'),
    email: stryMutAct_9fa48("4337") ? "" : (stryCov_9fa48("4337"), 'darwin@charles.io')
  })])
});