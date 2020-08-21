import map from 'lodash/map';
import { thresholdOptions } from './constants';
import { Option } from 'core/components/Form/Select/interfaces';
import find from 'lodash/find';

export const normalizeMetricOptions = (metrics: string[]) =>
  map(metrics, item => ({
    label: item,
    value: item
  }));

export const getCondition = (condition: string) =>
  thresholdOptions.find(({ value }) => condition === value);

export const getDataSourceDefaultValue = (id: string, options: Option[]) => {
  const result = find(options, { value: id });
  console.log(result);
  return result;
};
