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

import { Webhook } from 'modules/Settings/Credentials/Sections/Webhook/interfaces';
import { postRequest, patchRequest, baseRequest, deleteRequest } from './base';
export const mooveEndpoint = stryMutAct_9fa48("1936") ? "" : (stryCov_9fa48("1936"), '/moove/v1');
export const endpoint = stryMutAct_9fa48("1937") ? `` : (stryCov_9fa48("1937"), `${mooveEndpoint}/webhooks`);
export const saveConfig = stryMutAct_9fa48("1938") ? () => undefined : (stryCov_9fa48("1938"), (() => {
  const saveConfig = (webhook: Webhook) => postRequest(endpoint, webhook);

  return saveConfig;
})());
export const getConfig = stryMutAct_9fa48("1939") ? () => undefined : (stryCov_9fa48("1939"), (() => {
  const getConfig = (id: string) => baseRequest(stryMutAct_9fa48("1940") ? `` : (stryCov_9fa48("1940"), `${endpoint}/${id}`));

  return getConfig;
})());
export const editConfig = stryMutAct_9fa48("1941") ? () => undefined : (stryCov_9fa48("1941"), (() => {
  const editConfig = (id: string, value: string[]) => patchRequest(stryMutAct_9fa48("1942") ? `` : (stryCov_9fa48("1942"), `${endpoint}/${id}`), stryMutAct_9fa48("1943") ? "" : (stryCov_9fa48("1943"), 'replace'), stryMutAct_9fa48("1944") ? "" : (stryCov_9fa48("1944"), '/events'), value);

  return editConfig;
})());
export const delConfig = stryMutAct_9fa48("1945") ? () => undefined : (stryCov_9fa48("1945"), (() => {
  const delConfig = (id: string) => deleteRequest(stryMutAct_9fa48("1946") ? `` : (stryCov_9fa48("1946"), `${endpoint}/${id}`));

  return delConfig;
})());