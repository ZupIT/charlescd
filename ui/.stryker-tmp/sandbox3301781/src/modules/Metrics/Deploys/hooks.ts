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

import { useCallback } from 'react';
import { findDeployMetrics, findAllReleases } from 'core/providers/metrics';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { DeployMetricData, ReleaseHistoryResponse, ReleaseHistoryRequest } from './interfaces';
import { buildParams, URLParams } from 'core/utils/query';
interface DeployMetric extends FetchProps {
  searchDeployMetrics: Function;
  response: DeployMetricData;
}
export const useDeployMetric = (): DeployMetric => {
  if (stryMutAct_9fa48("5047")) {
    {}
  } else {
    stryCov_9fa48("5047");
    const [deployData, searchDeployData] = useFetch<DeployMetricData>(findDeployMetrics);
    const {
      response,
      loading
    } = deployData;
    const searchDeployMetrics = useCallback((payload: URLParams) => {
      if (stryMutAct_9fa48("5048")) {
        {}
      } else {
        stryCov_9fa48("5048");
        const params = buildParams(payload);
        searchDeployData(params);
      }
    }, stryMutAct_9fa48("5049") ? [] : (stryCov_9fa48("5049"), [searchDeployData]));
    return stryMutAct_9fa48("5050") ? {} : (stryCov_9fa48("5050"), {
      searchDeployMetrics,
      response,
      loading
    });
  }
};
export const useReleaseHistory = () => {
  if (stryMutAct_9fa48("5051")) {
    {}
  } else {
    stryCov_9fa48("5051");
    const [releaseData, getReleaseData] = useFetch<ReleaseHistoryResponse>(findAllReleases);
    const {
      response,
      loading
    } = releaseData;
    const getReleaseHistory = useCallback((payload: URLParams, releaseHistory: ReleaseHistoryRequest) => {
      if (stryMutAct_9fa48("5052")) {
        {}
      } else {
        stryCov_9fa48("5052");
        const params = buildParams(payload);
        getReleaseData(params, releaseHistory);
      }
    }, stryMutAct_9fa48("5053") ? [] : (stryCov_9fa48("5053"), [getReleaseData]));
    return stryMutAct_9fa48("5054") ? {} : (stryCov_9fa48("5054"), {
      getReleaseHistory,
      response,
      loading
    });
  }
};