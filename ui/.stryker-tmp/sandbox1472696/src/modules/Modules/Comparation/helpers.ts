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

import { NEW_TAB } from 'core/components/TabPanel/constants';
export const resolveParams = (param: string) => {
  if (stryMutAct_9fa48("5316")) {
    {}
  } else {
    stryCov_9fa48("5316");
    const [id, initMode] = stryMutAct_9fa48("5317") ? param.split('~') : (stryCov_9fa48("5317"), param?.split(stryMutAct_9fa48("5318") ? "" : (stryCov_9fa48("5318"), '~')));
    const mode = (stryMutAct_9fa48("5321") ? param !== NEW_TAB : stryMutAct_9fa48("5320") ? false : stryMutAct_9fa48("5319") ? true : (stryCov_9fa48("5319", "5320", "5321"), param === NEW_TAB)) ? stryMutAct_9fa48("5322") ? "" : (stryCov_9fa48("5322"), 'edit') : stryMutAct_9fa48("5323") ? "" : (stryCov_9fa48("5323"), 'view');
    return stryMutAct_9fa48("5324") ? [] : (stryCov_9fa48("5324"), [id, stryMutAct_9fa48("5327") ? initMode && mode : stryMutAct_9fa48("5326") ? false : stryMutAct_9fa48("5325") ? true : (stryCov_9fa48("5325", "5326", "5327"), initMode || mode)]);
  }
};
export const pathModuleById = (id: string) => {
  if (stryMutAct_9fa48("5328")) {
    {}
  } else {
    stryCov_9fa48("5328");
    const URL_PATH_POSITION = 0;
    const path = window.location.href.split(stryMutAct_9fa48("5329") ? "" : (stryCov_9fa48("5329"), '?'))[URL_PATH_POSITION];
    return stryMutAct_9fa48("5330") ? `` : (stryCov_9fa48("5330"), `${path}?module=${id}`);
  }
};