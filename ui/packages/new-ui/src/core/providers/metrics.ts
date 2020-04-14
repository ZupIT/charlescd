import { CircleMetrics } from 'containers/Metrics/interfaces';
import { baseRequest } from './base';

const endpoint = '/moove/metrics';

export const findCircleMetrics = (data: CircleMetrics) => {
  const params = new URLSearchParams({ ...data });
  return baseRequest(`${endpoint}/?${params}`);
};
