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
    [METRICS_TYPE.REQUESTS_ERRORS_BY_CIRCLE]: theme.metrics.chartError,
    [METRICS_TYPE.REQUESTS_BY_CIRCLE]: theme.metrics.chartRequestCircle,
    [METRICS_TYPE.REQUESTS_LATENCY_BY_CIRCLE]: theme.metrics.chartLatency
  }[metricType];

  return chartType === CHART_TYPE.NORMAL
    ? [metricColor]
    : theme.metrics.chartComparison;
};
