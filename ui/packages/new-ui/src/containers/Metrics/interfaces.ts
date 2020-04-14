import { METRICS_TYPE, PROJECTION_TYPE } from './enums';

export interface CircleMetrics {
  circleId?: string;
  projectionType?: PROJECTION_TYPE;
  metricType?: METRICS_TYPE;
}

export interface CircleMetricsData {
  timestamp: number;
  value: number;
}

export interface CircleMetricsResponse {
  period: string;
  type: string;
  data: CircleMetricsData[];
}
