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

import { baseRequest, postRequest, deleteRequest, putRequest } from './base';
import {
  Metric,
  MetricsGroup
} from 'modules/Circles/Comparation/Item/MetricsGroups/types';

const endpoint = '/compass/api/v1';

export const getMetricsGroupsResumeById = (params: URLSearchParams) =>
  baseRequest(`${endpoint}/resume/metrics-groups?${params}`);

export const getAllMetricsGroupsById = (circleId: string) =>
  baseRequest(`${endpoint}/circles/${circleId}/metrics-groups`);

export const getAllMetricsProviders = () =>
  baseRequest(`${endpoint}/datasources`);

export const createMetric = (metricsGroupsId: string, metricPayload: Metric) =>
  postRequest(
    `${endpoint}/metrics-groups/${metricsGroupsId}/metrics`,
    metricPayload
  );

export const updateMetric = (metricsGroupsId: string, metricPayload: Metric) =>
  putRequest(
    `${endpoint}/metrics-groups/${metricsGroupsId}/metrics/${metricPayload.id}`,
    metricPayload
  );

export const getAllDataSourceMetrics = (datasourceId: string) =>
  baseRequest(`${endpoint}/datasources/${datasourceId}/metrics`);

export const saveMetricGroup = (metricsGroupPayload: MetricsGroup) =>
  postRequest(`${endpoint}/metrics-groups`, metricsGroupPayload);

export const deleteMetricGroup = (metricsGroupId: string) =>
  deleteRequest(`${endpoint}/metrics-groups/${metricsGroupId}`);

export const deleteMetricByMetricId = (
  metricsGroupId: string,
  metricId: string
) =>
  deleteRequest(
    `${endpoint}/metrics-groups/${metricsGroupId}/metrics/${metricId}`
  );

export const getChartDataByQuery = (
  metricsGroupId: string,
  params: URLSearchParams
) =>
  baseRequest(`${endpoint}/metrics-groups/${metricsGroupId}/query?${params}`);
