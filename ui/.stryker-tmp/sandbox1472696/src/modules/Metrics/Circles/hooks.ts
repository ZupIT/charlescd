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
import { findAllCirclesMetrics, findAllCirclesHistory, findAllCirclesReleases } from 'core/providers/metrics';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { CirclesMetricData, CirclesHistoryResponse, CircleReleasesResponse } from './interfaces';
import { buildParams, URLParams } from 'core/utils/query';
interface CirclesMetrics extends FetchProps {
  findAllCirclesData: Function;
  response: CirclesMetricData;
}
export const useCircles = (): CirclesMetrics => {
  if (stryMutAct_9fa48("4849")) {
    {}
  } else {
    stryCov_9fa48("4849");
    const [circlesData, getCircleData] = useFetch<CirclesMetricData>(findAllCirclesMetrics);
    const {
      response,
      loading
    } = circlesData;
    const findAllCirclesData = useCallback(() => {
      if (stryMutAct_9fa48("4850")) {
        {}
      } else {
        stryCov_9fa48("4850");
        getCircleData();
      }
    }, stryMutAct_9fa48("4851") ? [] : (stryCov_9fa48("4851"), [getCircleData]));
    return stryMutAct_9fa48("4852") ? {} : (stryCov_9fa48("4852"), {
      findAllCirclesData,
      response,
      loading
    });
  }
};
export const useCirclesHistory = () => {
  if (stryMutAct_9fa48("4853")) {
    {}
  } else {
    stryCov_9fa48("4853");
    const [circlesData, getCircleData] = useFetch<CirclesHistoryResponse>(findAllCirclesHistory);
    const {
      response,
      loading
    } = circlesData;
    const getCirclesHistory = useCallback((params: URLParams) => {
      if (stryMutAct_9fa48("4854")) {
        {}
      } else {
        stryCov_9fa48("4854");
        const queryParams = buildParams(params);
        getCircleData(queryParams);
      }
    }, stryMutAct_9fa48("4855") ? [] : (stryCov_9fa48("4855"), [getCircleData]));
    return stryMutAct_9fa48("4856") ? {} : (stryCov_9fa48("4856"), {
      getCirclesHistory,
      response,
      loading
    });
  }
};
export const useCirclesReleases = () => {
  if (stryMutAct_9fa48("4857")) {
    {}
  } else {
    stryCov_9fa48("4857");
    const [releasesData, getCircleData] = useFetch<CircleReleasesResponse>(findAllCirclesReleases);
    const {
      response,
      loading
    } = releasesData;
    const getCircleReleases = useCallback((params: URLParams, circleId: string) => {
      if (stryMutAct_9fa48("4858")) {
        {}
      } else {
        stryCov_9fa48("4858");
        const urlParams = buildParams(params);
        getCircleData(urlParams, circleId);
      }
    }, stryMutAct_9fa48("4859") ? [] : (stryCov_9fa48("4859"), [getCircleData]));
    return stryMutAct_9fa48("4860") ? {} : (stryCov_9fa48("4860"), {
      getCircleReleases,
      response,
      loading
    });
  }
};