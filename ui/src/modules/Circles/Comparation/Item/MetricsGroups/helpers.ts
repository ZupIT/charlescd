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
import { conditionOptions, operatorsOptions } from './constants';
import { Option } from 'core/components/Form/Select/interfaces';
import find from 'lodash/find';
import { MetricFilter, Metric, ChartDataByQuery, ChartData } from './types';

export const normalizeMetricOptions = (metrics: string[]) =>
  map(metrics, item => ({
    label: item,
    value: item
  }));

export const getCondition = (condition: string) =>
  conditionOptions.find(({ value }) => condition === value);

export const getOperator = (operator: string) =>
  operatorsOptions.find(({ value }) => operator === value);

export const getSelectDefaultValue = (id: string, options: Option[]) =>
  find(options, { value: id });

const buildMetricFilters = (
  formFilters?: MetricFilter[],
  metricFilters?: MetricFilter[]
) =>
  map(formFilters, (item, index) => ({
    ...item,
    id: metricFilters?.[index]?.id
  }));

export const buildMetricPayload = (formData: Metric, metric: Metric) => {
  const filters = metric?.id
    ? buildMetricFilters(formData.filters, metric?.filters)
    : formData.filters;

  const payload = {
    ...formData,
    threshold: Number(formData.threshold),
    filters,
    id: metric?.id
  } as Metric;

  return payload;
};

export const getThresholdStatus = (status: string) => {
  switch (status) {
    case 'REACHED': {
      return {
        icon: 'bell',
        color: 'reached',
        message: 'This metric has reached its goal.',
        ResumeMessage: 'This metrics group has reached its goal.'
      };
    }
    case 'ERROR': {
      return {
        icon: 'error',
        color: 'error',
        message: 'An error occurred in this metric.',
        ResumeMessage: 'There is at least one error in your metrics group.'
      };
    }
    default: {
      return {
        icon: 'bell',
        color: 'active',
        message: 'This metric has not yet reached its goal.',
        ResumeMessage: 'This metrics group has not yet reached its goal.'
      };
    }
  }
};

const buildSeriesData = (data: ChartData[]) =>
  map(data, item => ({
    x: item.period * 1000,
    y: item.total
  }));

export const getDeploySeries = (data: ChartDataByQuery) =>
  map(data, item => ({
    name: item.metric,
    data: buildSeriesData(item.result)
  }));
