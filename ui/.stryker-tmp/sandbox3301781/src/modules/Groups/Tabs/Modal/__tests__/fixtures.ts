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

import { UserChecked } from '../../../interfaces/UserChecked';
export const users = stryMutAct_9fa48("4350") ? [] : (stryCov_9fa48("4350"), [stryMutAct_9fa48("4351") ? {} : (stryCov_9fa48("4351"), {
  id: stryMutAct_9fa48("4352") ? "" : (stryCov_9fa48("4352"), 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f'),
  name: stryMutAct_9fa48("4353") ? "" : (stryCov_9fa48("4353"), 'User 2'),
  email: stryMutAct_9fa48("4354") ? "" : (stryCov_9fa48("4354"), 'user.2@zup.com.br'),
  checked: stryMutAct_9fa48("4355") ? false : (stryCov_9fa48("4355"), true)
}), stryMutAct_9fa48("4356") ? {} : (stryCov_9fa48("4356"), {
  id: stryMutAct_9fa48("4357") ? "" : (stryCov_9fa48("4357"), '13ea193b-f9d2-4wed-b1ce-471a7ae871c2'),
  name: stryMutAct_9fa48("4358") ? "" : (stryCov_9fa48("4358"), 'User 3'),
  email: stryMutAct_9fa48("4359") ? "" : (stryCov_9fa48("4359"), 'user.3@zup.com.br'),
  checked: stryMutAct_9fa48("4360") ? false : (stryCov_9fa48("4360"), true)
}), stryMutAct_9fa48("4361") ? {} : (stryCov_9fa48("4361"), {
  id: stryMutAct_9fa48("4362") ? "" : (stryCov_9fa48("4362"), '8b81e7a7-33f1-46cb-aedf-73222bf8769f'),
  name: stryMutAct_9fa48("4363") ? "" : (stryCov_9fa48("4363"), 'User 4'),
  email: stryMutAct_9fa48("4364") ? "" : (stryCov_9fa48("4364"), 'user.4@zup.com.br'),
  checked: stryMutAct_9fa48("4365") ? false : (stryCov_9fa48("4365"), true)
})]);
export const emptyUsers: UserChecked[] = stryMutAct_9fa48("4366") ? ["Stryker was here"] : (stryCov_9fa48("4366"), []);