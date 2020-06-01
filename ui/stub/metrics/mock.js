const METRICS_TYPE = {
  REQUESTS_BY_CIRCLE: "REQUESTS_BY_CIRCLE",
  REQUESTS_ERRORS_BY_CIRCLE: "REQUESTS_ERRORS_BY_CIRCLE",
  REQUESTS_LATENCY_BY_CIRCLE: "REQUESTS_LATENCY_BY_CIRCLE"
};

const METRICS_SPEED = {
  SLOW_TIME: 300000,
  FAST_TIME: 10000
};

const CHART_TYPE = {
  COMPARISON: "COMPARISON",
  NORMAL: "NORMAL"
};

const PROJECTION_TYPE = {
  FIVE_MINUTES: "FIVE_MINUTES",
  THIRTY_MINUTES: "THIRTY_MINUTES",
  ONE_HOUR: "ONE_HOUR",
  THREE_HOUR: "THREE_HOUR",
  EIGHT_HOUR: "EIGHT_HOUR"
};

const CircleMetricsData = {
  period: {
    value: 1,
    label: "h"
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
    circleId: "f52eda57-5607-4306-te33-477eg398cc2a",
    projectionType: PROJECTION_TYPE,
    metricType: METRICS_TYPE
  },
  {
    circleId: "883t35d8-dece-412f-9w25-f37h54e56fa5",
    projectionType: PROJECTION_TYPE,
    metricType: METRICS_TYPE
  },
  {
    circleId: "cay5h4a5-6278-45b5-ab15-a53e76tdbc3e",
    projectionType: PROJECTION_TYPE,
    metricType: METRICS_TYPE
  }
];

module.exports = {
  CircleMetricsData,
  CirclesMetrics
};
