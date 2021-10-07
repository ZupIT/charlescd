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

import { CreateDeployment } from 'modules/Circles/Release/interfaces/Deployment';
import { postRequest, baseRequest } from './base';
const v2Endpoint = stryMutAct_9fa48("1670") ? "" : (stryCov_9fa48("1670"), '/moove/v2/deployments');
export const createDeployment = stryMutAct_9fa48("1671") ? () => undefined : (stryCov_9fa48("1671"), (() => {
  const createDeployment = (data: CreateDeployment) => postRequest(v2Endpoint, data);

  return createDeployment;
})());
export const undeploy = stryMutAct_9fa48("1672") ? () => undefined : (stryCov_9fa48("1672"), (() => {
  const undeploy = (deploymentId: string) => postRequest(stryMutAct_9fa48("1673") ? `` : (stryCov_9fa48("1673"), `${v2Endpoint}/${deploymentId}/undeploy`));

  return undeploy;
})());
export const getDeployHistoryByCircleId = (params: URLSearchParams, circleId: string) => {
  if (stryMutAct_9fa48("1674")) {
    {}
  } else {
    stryCov_9fa48("1674");
    params.append(stryMutAct_9fa48("1675") ? "" : (stryCov_9fa48("1675"), 'size'), stryMutAct_9fa48("1676") ? "" : (stryCov_9fa48("1676"), '10'));
    return baseRequest(stryMutAct_9fa48("1677") ? `` : (stryCov_9fa48("1677"), `${v2Endpoint}/circle/${circleId}/history?${params}`));
  }
};
export const findDeployLogsByDeploymentId = stryMutAct_9fa48("1678") ? () => undefined : (stryCov_9fa48("1678"), (() => {
  const findDeployLogsByDeploymentId = (deploymentId: string) => baseRequest(stryMutAct_9fa48("1679") ? `` : (stryCov_9fa48("1679"), `${v2Endpoint}/${deploymentId}/logs`));

  return findDeployLogsByDeploymentId;
})());