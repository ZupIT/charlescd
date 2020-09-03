import { Metric } from "../types";

export const MetricsGroupChartData = {
  id: "d4b69bf8-34cd-4bf0-81c3-781202f16dd6",
  metric: "test 12",
  result: [
    {
      total: 10,
      period: 1599074229
    }
  ]
};

const Execution = {
  lastValue: 0,
  status: 'ERROR'
}

export const metricsData: Metric = {
  id: "1a",
  nickname: "test 1a",
  createdAt: "test",
  metricGroupId: "d4b69bf8-34cd-4bf0-81c3-781202f17fe7",
  condition: 'EQUAL',
  threshold: 10,
  status: 'ACTIVE',
  execution: Execution,
  circleId: "d4b69bf8-34cd-4bf0-81c3-781202f16dd6",
  dataSourceId: 'abc123',
  metric: 'metric xyz'
};

export const MetricsGroupData = [{
  id: "d4b69bf8-34cd-4bf0-81c3-781202f17fe7",
  circleId: "d4b69bf8-34cd-4bf0-81c3-781202f16dd6",
  name: "test 1",
  metrics: [metricsData],
  status: "ACTIVE"
}];

export const OptionsValues = [
  {
    "label": "1",
    "value": "1"
  },
  {
    "label": "2",
    "value": "2"
  }
];

export const ThresholdStatusResponse = [
  {
    icon: 'bell',
    color: 'reached',
    message: 'This metric has reached its goal.',
    ResumeMessage: 'This metrics group has reached its goal.'
  },
  {
    icon: 'error',
    color: 'error',
    message: 'An error occurred in this metric.',
    ResumeMessage: 'There is at least one error in your metrics group.'
  },
  {
    icon: 'bell',
    color: 'active',
    message: 'This metric has not yet reached its goal.',
    ResumeMessage: 'This metrics group has not yet reached its goal.'
  }
];

export const dataForMetricsSeriesTests = [{
  id: '1',
  metric: 'test 1',
  result: [
    {
      total: 10,
      period: 1
    }
  ]
}];

export const dataFormatted = [{
  name: 'test 1',
  data: [
    {
      y: 10,
      x: 1000
    }
  ]
}];
