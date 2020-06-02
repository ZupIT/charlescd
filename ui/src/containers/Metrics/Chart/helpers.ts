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

import map from 'lodash/map';
import { getTheme } from 'core/utils/themes';
import { METRICS_TYPE, CHART_TYPE } from './enums';
import { CircleMetricsData } from './interfaces';

const theme = getTheme();

export const toList = (data: CircleMetricsData[]) =>
  map(data, ({ value, timestamp }) => [timestamp, value]);

export const getChartColor = (
  metricType: METRICS_TYPE,
  chartType: CHART_TYPE
) => {
  const metricColor = {
    [METRICS_TYPE.REQUESTS_ERRORS_BY_CIRCLE]: theme.metrics.chart.error,
    [METRICS_TYPE.REQUESTS_BY_CIRCLE]: theme.metrics.chart.requestCircle,
    [METRICS_TYPE.REQUESTS_LATENCY_BY_CIRCLE]: theme.metrics.chart.latency
  }[metricType];

  return chartType === CHART_TYPE.NORMAL
    ? [metricColor]
    : theme.metrics.chart.comparison;
};
