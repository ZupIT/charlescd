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

import { baseRequest, postRequest, deleteRequest, putRequest } from './base';
import { Metric, MetricsGroup, ActionGroupPayload, Action } from 'modules/Circles/Comparation/Item/MetricsGroups/types';
const endpoint = stryMutAct_9fa48("1722") ? "" : (stryCov_9fa48("1722"), '/compass/api/v1');
export const getMetricsGroupsResumeById = stryMutAct_9fa48("1723") ? () => undefined : (stryCov_9fa48("1723"), (() => {
  const getMetricsGroupsResumeById = (params: URLSearchParams) => baseRequest(stryMutAct_9fa48("1724") ? `` : (stryCov_9fa48("1724"), `${endpoint}/resume/metrics-groups?${params}`));

  return getMetricsGroupsResumeById;
})());
export const getAllMetricsGroupsById = stryMutAct_9fa48("1725") ? () => undefined : (stryCov_9fa48("1725"), (() => {
  const getAllMetricsGroupsById = (circleId: string) => baseRequest(stryMutAct_9fa48("1726") ? `` : (stryCov_9fa48("1726"), `${endpoint}/circles/${circleId}/metrics-groups`));

  return getAllMetricsGroupsById;
})());
export const getAllMetricsProviders = stryMutAct_9fa48("1727") ? () => undefined : (stryCov_9fa48("1727"), (() => {
  const getAllMetricsProviders = () => baseRequest(stryMutAct_9fa48("1728") ? `` : (stryCov_9fa48("1728"), `${endpoint}/datasources`));

  return getAllMetricsProviders;
})());
export const createMetric = stryMutAct_9fa48("1729") ? () => undefined : (stryCov_9fa48("1729"), (() => {
  const createMetric = (metricsGroupsId: string, metricPayload: Metric) => postRequest(stryMutAct_9fa48("1730") ? `` : (stryCov_9fa48("1730"), `${endpoint}/metrics-groups/${metricsGroupsId}/metrics`), metricPayload);

  return createMetric;
})());
export const updateMetric = stryMutAct_9fa48("1731") ? () => undefined : (stryCov_9fa48("1731"), (() => {
  const updateMetric = (metricsGroupsId: string, metricPayload: Metric) => putRequest(stryMutAct_9fa48("1732") ? `` : (stryCov_9fa48("1732"), `${endpoint}/metrics-groups/${metricsGroupsId}/metrics/${metricPayload.id}`), metricPayload);

  return updateMetric;
})());
export const getAllDataSourceMetrics = stryMutAct_9fa48("1733") ? () => undefined : (stryCov_9fa48("1733"), (() => {
  const getAllDataSourceMetrics = (datasourceId: string) => baseRequest(stryMutAct_9fa48("1734") ? `` : (stryCov_9fa48("1734"), `${endpoint}/datasources/${datasourceId}/metrics`));

  return getAllDataSourceMetrics;
})());
export const createMetricGroup = stryMutAct_9fa48("1735") ? () => undefined : (stryCov_9fa48("1735"), (() => {
  const createMetricGroup = (metricsGroupPayload: MetricsGroup) => postRequest(stryMutAct_9fa48("1736") ? `` : (stryCov_9fa48("1736"), `${endpoint}/metrics-groups`), metricsGroupPayload);

  return createMetricGroup;
})());
export const updateMetricGroup = stryMutAct_9fa48("1737") ? () => undefined : (stryCov_9fa48("1737"), (() => {
  const updateMetricGroup = (metricsGroupPayload: MetricsGroup, metricGroupId: string) => baseRequest(stryMutAct_9fa48("1738") ? `` : (stryCov_9fa48("1738"), `${endpoint}/metrics-groups/${metricGroupId}`), metricsGroupPayload, stryMutAct_9fa48("1739") ? {} : (stryCov_9fa48("1739"), {
    method: stryMutAct_9fa48("1740") ? "" : (stryCov_9fa48("1740"), 'PATCH')
  }));

  return updateMetricGroup;
})());
export const deleteMetricGroup = stryMutAct_9fa48("1741") ? () => undefined : (stryCov_9fa48("1741"), (() => {
  const deleteMetricGroup = (metricsGroupId: string) => deleteRequest(stryMutAct_9fa48("1742") ? `` : (stryCov_9fa48("1742"), `${endpoint}/metrics-groups/${metricsGroupId}`));

  return deleteMetricGroup;
})());
export const deleteMetricByMetricId = stryMutAct_9fa48("1743") ? () => undefined : (stryCov_9fa48("1743"), (() => {
  const deleteMetricByMetricId = (metricsGroupId: string, metricId: string) => deleteRequest(stryMutAct_9fa48("1744") ? `` : (stryCov_9fa48("1744"), `${endpoint}/metrics-groups/${metricsGroupId}/metrics/${metricId}`));

  return deleteMetricByMetricId;
})());
export const getChartDataByQuery = stryMutAct_9fa48("1745") ? () => undefined : (stryCov_9fa48("1745"), (() => {
  const getChartDataByQuery = (metricsGroupId: string, params: URLSearchParams) => baseRequest(stryMutAct_9fa48("1746") ? `` : (stryCov_9fa48("1746"), `${endpoint}/metrics-groups/${metricsGroupId}/query?${params}`));

  return getChartDataByQuery;
})());
export const getAllActionsTypes = stryMutAct_9fa48("1747") ? () => undefined : (stryCov_9fa48("1747"), (() => {
  const getAllActionsTypes = () => baseRequest(stryMutAct_9fa48("1748") ? `` : (stryCov_9fa48("1748"), `${endpoint}/actions`));

  return getAllActionsTypes;
})());
export const createAction = stryMutAct_9fa48("1749") ? () => undefined : (stryCov_9fa48("1749"), (() => {
  const createAction = (actionGroupPayload: ActionGroupPayload) => postRequest(stryMutAct_9fa48("1750") ? `` : (stryCov_9fa48("1750"), `${endpoint}/group-actions`), actionGroupPayload);

  return createAction;
})());
export const deleteActionByActionId = stryMutAct_9fa48("1751") ? () => undefined : (stryCov_9fa48("1751"), (() => {
  const deleteActionByActionId = (actionId: string) => deleteRequest(stryMutAct_9fa48("1752") ? `` : (stryCov_9fa48("1752"), `${endpoint}/group-actions/${actionId}`));

  return deleteActionByActionId;
})());
export const updateAction = stryMutAct_9fa48("1753") ? () => undefined : (stryCov_9fa48("1753"), (() => {
  const updateAction = (actionPayload: Action, actionId: string) => putRequest(stryMutAct_9fa48("1754") ? `` : (stryCov_9fa48("1754"), `${endpoint}/group-actions/${actionId}`), actionPayload);

  return updateAction;
})());
export const getGroupActionById = stryMutAct_9fa48("1755") ? () => undefined : (stryCov_9fa48("1755"), (() => {
  const getGroupActionById = (actionId: string) => baseRequest(stryMutAct_9fa48("1756") ? `` : (stryCov_9fa48("1756"), `${endpoint}/group-actions/${actionId}`));

  return getGroupActionById;
})());