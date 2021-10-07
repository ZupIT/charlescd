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

import { useCallback } from 'react';
import { useFetch, useFetchData } from 'core/providers/base/hooks';
import { buildParams, URLParams } from 'core/utils/query';
import { getDeployHistoryByCircleId, findDeployLogsByDeploymentId } from 'core/providers/deployment';
import { CircleReleasesResponse } from 'modules/Metrics/Circles/interfaces';
import { CircleDeploymentLogs } from './types';
export const useCircleDeployHistory = () => {
  if (stryMutAct_9fa48("2860")) {
    {}
  } else {
    stryCov_9fa48("2860");
    const [releasesData, getCircleData] = useFetch<CircleReleasesResponse>(getDeployHistoryByCircleId);
    const {
      response,
      loading
    } = releasesData;
    const getCircleReleases = useCallback((params: URLParams, circleId: string) => {
      if (stryMutAct_9fa48("2861")) {
        {}
      } else {
        stryCov_9fa48("2861");
        const urlParams = buildParams(params);
        getCircleData(urlParams, circleId);
      }
    }, stryMutAct_9fa48("2862") ? [] : (stryCov_9fa48("2862"), [getCircleData]));
    return stryMutAct_9fa48("2863") ? {} : (stryCov_9fa48("2863"), {
      getCircleReleases,
      response,
      loading
    });
  }
};
export const useCircleDeployLogs = () => {
  if (stryMutAct_9fa48("2864")) {
    {}
  } else {
    stryCov_9fa48("2864");
    const getLogsDataRequest = useFetchData<CircleDeploymentLogs[]>(findDeployLogsByDeploymentId);
    const getLogsData = useCallback(async (deploymentId: string) => {
      if (stryMutAct_9fa48("2865")) {
        {}
      } else {
        stryCov_9fa48("2865");

        try {
          if (stryMutAct_9fa48("2866")) {
            {}
          } else {
            stryCov_9fa48("2866");
            const logsResponseData = await getLogsDataRequest(deploymentId);
            return logsResponseData;
          }
        } catch (e) {
          if (stryMutAct_9fa48("2867")) {
            {}
          } else {
            stryCov_9fa48("2867");
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("2868") ? [] : (stryCov_9fa48("2868"), [getLogsDataRequest]));
    return stryMutAct_9fa48("2869") ? {} : (stryCov_9fa48("2869"), {
      getLogsData
    });
  }
};