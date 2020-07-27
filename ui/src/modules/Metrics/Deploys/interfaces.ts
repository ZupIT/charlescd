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

import { Pagination } from 'core/interfaces/Pagination';

export interface DeployMetricData {
  successfulDeployments: number;
  failedDeployments: number;
  successfulDeploymentsAverageTime: number;
  successfulDeploymentsInPeriod: MetricDataInPeriod[];
  failedDeploymentsInPeriod: MetricDataInPeriod[];
  deploymentsAverageTimeInPeriod: MetricDataInPeriod[];
}

export interface MetricDataInPeriod {
  total?: number;
  averageTime: number;
  period: string;
}

export enum PERIOD_PARAM {
  ONE_WEEK = 'ONE_WEEK',
  TWO_WEEKS = 'TWO_WEEKS',
  ONE_MONTH = 'ONE_MONTH',
  THREE_MONTHS = 'THREE_MONTHS'
}

export interface ReleaseHistoryRequest {
  deploymentName?: string;
  period?: string;
  circles?: string[];
  deploymentStatus?: string[];
}

export interface ReleaseHistorySummary {
  deployed: number;
  deploying: number;
  failed: number;
  undeploying: number;
  notDeployed: number;
}

export interface ReleaseHistoryResponse {
  summary: ReleaseHistorySummary;
  page: Pagination<ReleaseHistory>;
}

export interface ReleaseHistory {
  id: string;
  deployedAt: string;
  undeployedAt: string;
  authorName: string;
  circleName: string;
  tag: string;
  status: string;
  deployDuration: number;
  components: ReleaseHistoryComponents[];
}

export interface ReleaseHistoryComponents {
  name: string;
  moduleName: string;
  version: string;
}
