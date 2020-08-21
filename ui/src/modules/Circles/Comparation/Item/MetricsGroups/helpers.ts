import map from 'lodash/map';

export const normalizeMetricOptions = (metrics: string[]) =>
  map(metrics, item => ({
    label: item,
    value: item
  }));
