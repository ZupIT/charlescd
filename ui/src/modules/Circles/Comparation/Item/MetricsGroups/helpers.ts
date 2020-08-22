import map from 'lodash/map';
import { conditionOptions, operatorsOptions } from './constants';
import { Option } from 'core/components/Form/Select/interfaces';
import find from 'lodash/find';

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
