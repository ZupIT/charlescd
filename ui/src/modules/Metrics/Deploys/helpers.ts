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

import { DeployMetricData, MetricDataInPeriod } from './interfaces';
import map from 'lodash/map';
import dayjs from 'dayjs';

const buildSeriesData = (metricData: MetricDataInPeriod[]) =>
  map(metricData, item => ({
    x: item.period,
    y: item.total
  }));

export const getDeploySeries = (data: DeployMetricData) => [
  {
    name: 'Deploy',
    type: 'column',
    data: buildSeriesData(data?.successfulDeploymentsInPeriod)
  },
  {
    name: 'Error',
    type: 'column',
    data: buildSeriesData(data?.failedDeploymentsInPeriod)
  },
  {
    name: 'Avarege time',
    type: 'area',
    data: map(data?.deploymentsAverageTimeInPeriod, DeploymentAverageTime => ({
      x: DeploymentAverageTime.period,
      y: DeploymentAverageTime.averageTime
    }))
  }
];

export const chartDateFormatter = (date: string) => {
  return dayjs(date, 'YYYY-MM-DD').format('DDMMM');
};

export const getPlotOption = (deploySeries: Array<any>) => {
  const plotOptionsMin = { bar: { columnWidth: '25%' } };
  const plotOptionsMax = { bar: { columnWidth: '50%' } };

  const deploy = deploySeries[0].data[2];
  const error = deploySeries[1].data[2];

  return !(deploy || error) ? plotOptionsMin : plotOptionsMax;
};
