import random from 'lodash/random';

const METRICS_TYPE = {
  REQUESTS_BY_CIRCLE: 'REQUESTS_BY_CIRCLE',
  REQUESTS_ERRORS_BY_CIRCLE: 'REQUESTS_ERRORS_BY_CIRCLE',
  REQUESTS_LATENCY_BY_CIRCLE: 'REQUESTS_LATENCY_BY_CIRCLE'
};

const METRICS_SPEED = {
  SLOW_TIME: 300000,
  FAST_TIME: 10000
};

const CHART_TYPE = {
  COMPARISON: 'COMPARISON',
  NORMAL: 'NORMAL'
};

const PROJECTION_TYPE = {
  FIVE_MINUTES: 'FIVE_MINUTES',
  THIRTY_MINUTES: 'THIRTY_MINUTES',
  ONE_HOUR: 'ONE_HOUR',
  THREE_HOUR: 'THREE_HOUR',
  EIGHT_HOUR: 'EIGHT_HOUR'
};

const CircleMetricsData = {
  period: {
    value: 1,
    label: 'h'
  },
  data: [
    {
      timestamp: 1580389800,
      value: 5
    },
    {
      timestamp: 1580390100,
      value: 50
    },
    {
      timestamp: 1580390400,
      value: 10
    },
    {
      timestamp: 1580390700,
      value: 340
    },
    {
      timestamp: 1580391000,
      value: 1
    }
  ]
};

const CirclesMetrics = [
  {
    circleId: 'f52eda57-5607-4306-te33-477eg398cc2a',
    projectionType: PROJECTION_TYPE,
    metricType: METRICS_TYPE
  },
  {
    circleId: '883t35d8-dece-412f-9w25-f37h54e56fa5',
    projectionType: PROJECTION_TYPE,
    metricType: METRICS_TYPE
  },
  {
    circleId: 'cay5h4a5-6278-45b5-ab15-a53e76tdbc3e',
    projectionType: PROJECTION_TYPE,
    metricType: METRICS_TYPE
  }
];

const DeployMetrics = () => ({
  successfulDeploymentsQuantity: 27,
  failedDeploymentsQuantity: 0,
  successfulDeploymentsAverageTimeInSeconds: 87,
  successfulDeploymentsInPeriod: [
    {
      total: random(0, 10),
      averageTime: 207,
      date: '08-12-2020'
    },
    {
      total: random(0, 40),
      averageTime: 30,
      date: '08-13-2020'
    },
    {
      total: random(0, 25),
      averageTime: 90,
      date: '08-14-2020'
    },
    {
      total: random(0, 150),
      averageTime: 27,
      date: '08-15-2020'
    },
    {
      total: random(0, 80),
      averageTime: 63,
      date: '08-16-2020'
    },
    {
      total: random(0, 130),
      averageTime: 80,
      date: '08-17-2020'
    },
    {
      total: random(0, 2),
      averageTime: 195,
      date: '08-18-2020'
    }
  ],
  failedDeploymentsInPeriod: [
    {
      total: random(0, 5),
      averageTime: 207,
      date: '08-12-2020'
    },
    {
      total: random(0, 10),
      averageTime: 30,
      date: '08-13-2020'
    },
    {
      total: random(0, 14),
      averageTime: 90,
      date: '08-14-2020'
    },
    {
      total: random(0, 60),
      averageTime: 27,
      date: '08-15-2020'
    },
    {
      total: random(0, 40),
      averageTime: 27,
      date: '08-16-2020'
    },
    {
      total: random(0, 20),
      averageTime: 27,
      date: '08-17-2020'
    },
    {
      total: random(0, 0),
      averageTime: 195,
      date: '08-18-2020'
    }
  ],
  deploymentsAverageTimeInPeriod: [
    {
      averageTime: 203,
      date: '08-12-2020'
    },
    {
      averageTime: 102,
      date: '08-13-2020'
    },
    {
      averageTime: 330,
      date: '08-14-2020'
    },
    {
      averageTime: 83,
      date: '08-15-2020'
    },
    {
      averageTime: 26,
      date: '08-16-2020'
    },
    {
      averageTime: 150,
      date: '08-17-2020'
    },
    {
      averageTime: 203,
      date: '08-18-2020'
    }
  ]
});

export default {
  CircleMetricsData,
  CirclesMetrics,
  DeployMetrics
};
