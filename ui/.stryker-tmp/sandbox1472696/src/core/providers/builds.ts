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

import { ModuleForm } from 'modules/Circles/Release/interfaces/Module';
import { FilterBuild } from 'modules/Circles/Release/interfaces/Build';
import { postRequest, baseRequest } from './base';
import { buildParams, URLParams } from 'core/utils/query';
const endpoint = stryMutAct_9fa48("1561") ? "" : (stryCov_9fa48("1561"), '/moove/v2/builds');
export const composeBuild = stryMutAct_9fa48("1562") ? () => undefined : (stryCov_9fa48("1562"), (() => {
  const composeBuild = (data: ModuleForm) => postRequest(stryMutAct_9fa48("1563") ? `` : (stryCov_9fa48("1563"), `${endpoint}/compose`), data);

  return composeBuild;
})());
export const findBuilds = stryMutAct_9fa48("1564") ? () => undefined : (stryCov_9fa48("1564"), (() => {
  const findBuilds = (data: FilterBuild) => baseRequest(stryMutAct_9fa48("1565") ? `` : (stryCov_9fa48("1565"), `${endpoint}?${buildParams((data as URLParams))}`));

  return findBuilds;
})());