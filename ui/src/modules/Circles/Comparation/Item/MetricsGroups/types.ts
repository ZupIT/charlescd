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

export type MetricsGroupsResume = {
  id: string;
  createdAt: string;
  name: string;
  metricsCount?: number;
  thresholds: number;
  thresholdsReached: number;
  status: string;
};

export type MetricsGroup = {
  id?: string;
  createdAt?: string;
  name: string;
  metrics?: Metric[];
  status?: string;
  circleId: string;
};

export type Metric = {
  id: string;
  nickname: string;
  query?: string;
  createdAt: string;
  metricGroupId: string;
  dataSourceId: string;
  metric?: string;
  filters?: MetricFilter[];
  groupBy?: MetricGroupBy[];
  condition: string;
  threshold: number;
  status: string;
  execution: Execution;
  circleId: string;
};

export type Execution = {
  lastValue: number;
  status: string;
};

export type MetricFilter = {
  id?: string;
  createdAt?: string;
  field: string;
  value: string;
  operator: string;
};

export type MetricGroupBy = {
  id?: string;
  createdAt?: string;
  field: string;
};

export type DataSource = {
  id: string;
  createdAt: string;
  name: string;
  pluginId: string;
  health: boolean;
  data: DataSourceData;
};

export type DataSourceData = {
  url: string;
};

export type ChartDataByQuery = {
  id: string;
  metric: string;
  result: ChartData[];
}[];

export type ChartData = {
  total: number;
  period: number;
};
