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

import { CircleMetrics } from 'containers/Metrics/Chart/interfaces';
import { ReleaseHistoryRequest } from 'modules/Metrics/Deploys/interfaces';
import { baseRequest, postRequest } from './base';

const endpoint = '/moove/metrics';

const circlesEndpoint = '/moove/v2/circles';

const deploymentEndpoint = '/moove/v2/deployments';

export const findCircleMetrics = (data: CircleMetrics) => {
  const params = new URLSearchParams({ ...data });
  return baseRequest(`${endpoint}/?${params}`);
};

export const findDeployMetrics = (params: URLSearchParams) =>
  baseRequest(`${endpoint}/deployments?${params}`);

export const findAllCirclesMetrics = () => baseRequest(`${endpoint}/circles`);

export const findAllCirclesHistory = (params: URLSearchParams) =>
  baseRequest(`${circlesEndpoint}/history?${params}`);

export const findAllCirclesReleases = (
  params: URLSearchParams,
  circleId: string
) => baseRequest(`${deploymentEndpoint}/circle/${circleId}/history?${params}`);

export const findAllReleases = (
  params: URLSearchParams,
  releaseHistory: ReleaseHistoryRequest
) => postRequest(`${deploymentEndpoint}/history?${params}`, releaseHistory);
