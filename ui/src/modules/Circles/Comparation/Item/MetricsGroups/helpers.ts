import map from 'lodash/map';
import { conditionOptions, operatorsOptions } from './constants';
import { Option } from 'core/components/Form/Select/interfaces';
import find from 'lodash/find';
import { MetricFilter, Metric } from './types';

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

export const getBlankFilter = () => {
  const id = Math.random()
    .toString(36)
    .slice(2);

  return {
    id,
    field: '',
    operator: '',
    value: ''
  };
};

export const getDefaultFilters = () => [getBlankFilter()];
