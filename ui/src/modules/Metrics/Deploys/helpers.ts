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

import { DeployMetricData } from './interfaces';
import map from 'lodash/map';

export const getDeploySeries = (data: DeployMetricData) => [
  {
    name: 'Deploy',
    data: map(data?.successfulDeploymentsInPeriod, successTotal => ({
      x: successTotal.period,
      y: successTotal.total
    }))
  },
  {
    name: 'Error',
    data: map(data?.failedDeploymentsInPeriod, failedTotal => ({
      x: failedTotal.period,
      y: failedTotal.total
    }))
  }
];

export const getAverageTimeSeries = (data: DeployMetricData) => [
  {
    name: 'Elapse time',
    data: map(data?.deploymentsAverageTimeInPeriod, DeploymentAverageTime => ({
      x: DeploymentAverageTime.period,
      y: DeploymentAverageTime.averageTime
    }))
  }
];
