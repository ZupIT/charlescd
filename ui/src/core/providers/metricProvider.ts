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

import { MetricProvider } from 'modules/Settings/Credentials/Sections/MetricProvider/interfaces';
import { postRequest, baseRequest } from './base';

const endpoint = '/moove/v2/configurations/metric-configurations';

const endpointMetrics = '/moove/metrics';

const endpointWorkspace = '/moove/v2/workspace';

export const configPath = '/metricConfigurationId';

export const create = (metricProvider: MetricProvider) =>
  postRequest(`${endpoint}`, metricProvider);

export const verifyProviderConnection = (params: URLSearchParams) =>
  baseRequest(`${endpointMetrics}/config/verify-provider-connection?${params}`);

export const metricProviderConfigConnection = (
  params: URLSearchParams,
  workspaceId: string
) =>
  baseRequest(
    `${endpointWorkspace}/${workspaceId}/config/verify-provider-connection?${params}`
  );
