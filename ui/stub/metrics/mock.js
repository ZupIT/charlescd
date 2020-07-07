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

const circleMetricsData = {
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

const circlesMetrics = [
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

const deployMetrics = () => ({
  successfulDeployments: 27,
  failedDeployments: 0,
  successfulDeploymentsAverageTime: 87,
  successfulDeploymentsInPeriod: [
    {
      total: random(0, 10),
      averageTime: 207,
      period: '08-12-2020'
    },
    {
      total: random(0, 40),
      averageTime: 30,
      period: '08-13-2020'
    },
    {
      total: random(0, 25),
      averageTime: 90,
      period: '08-14-2020'
    },
    {
      total: random(0, 150),
      averageTime: 27,
      period: '08-15-2020'
    },
    {
      total: random(0, 80),
      averageTime: 63,
      period: '08-16-2020'
    },
    {
      total: random(0, 130),
      averageTime: 80,
      period: '08-17-2020'
    },
    {
      total: random(0, 2),
      averageTime: 195,
      period: '08-18-2020'
    }
  ],
  failedDeploymentsInPeriod: [
    {
      total: random(0, 5),
      averageTime: 207,
      period: '08-12-2020'
    },
    {
      total: random(0, 10),
      averageTime: 30,
      period: '08-13-2020'
    },
    {
      total: random(0, 14),
      averageTime: 90,
      period: '08-14-2020'
    },
    {
      total: random(0, 60),
      averageTime: 27,
      period: '08-15-2020'
    },
    {
      total: random(0, 40),
      averageTime: 27,
      period: '08-16-2020'
    },
    {
      total: random(0, 20),
      averageTime: 27,
      period: '08-17-2020'
    },
    {
      total: random(0, 0),
      averageTime: 195,
      period: '08-18-2020'
    }
  ],
  deploymentsAverageTimeInPeriod: [
    {
      averageTime: 203,
      period: '08-12-2020'
    },
    {
      averageTime: 102,
      period: '08-13-2020'
    },
    {
      averageTime: 330,
      period: '08-14-2020'
    },
    {
      averageTime: 83,
      period: '08-15-2020'
    },
    {
      averageTime: 26,
      period: '08-16-2020'
    },
    {
      averageTime: 150,
      period: '08-17-2020'
    },
    {
      averageTime: 203,
      period: '08-18-2020'
    }
  ]
});

const allCirclesMetrics = {
  circleStats: {
    active: 12,
    inactive: 8
  },
  averageCircleLifeTime: 26,
  history: [
    {
      id: '123',
      circleStatus: 'ACTIVE',
      name: 'Circle',
      lifeTime: 2400,
      lastUpdate: '8-6-2020 15:48:37'
    },
    {
      id: '456',
      circleStatus: 'INACTIVE',
      name: 'Other Circle',
      lifeTime: 3670,
      lastUpdate: '8-7-2020 10:32:28'
    },
    {
      id: '789',
      circleStatus: 'ACTIVE',
      name: 'Another Circle',
      lifeTime: 1860,
      lastUpdate: '8-7-2020 10:32:28'
    }
  ]
};

const allCircleReleases = [
  {
    id: 'dnsafjhf',
    name: 'release-darwin-new-repos',
    deployed: '16/03/2020 • 15:01:26',
    undeployed: '16/03/2020 • 15:01:26',
    lastEditor: 'Leandro Latini',
    components: [
      {
        id: 'fgfdgjkii',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.1'
      },
      {
        id: 'llllllllll',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.2'
      },
      {
        id: '0000000000000',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.3'
      }
    ]
  },
  {
    id: 'jfdhfuhfds',
    name: 'release-darwin-new-test',
    deployed: '16/03/2020 • 15:01:26',
    undeployed: '16/03/2020 • 15:01:26',
    lastEditor: 'Leandro Latini',
    components: [
      {
        id: 'fgfdgjkii',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.1'
      },
      {
        id: 'llllllllll',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.2'
      },
      {
        id: '0000000000000',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.3'
      }
    ]
  },
  {
    id: 'dnsafjhffdsfjdsbh',
    name: 'release-darwin-new-gmfgoij',
    deployed: '16/03/2020 • 15:01:26',
    undeployed: '16/03/2020 • 15:01:26',
    lastEditor: 'Leandro Latini',
    components: [
      {
        id: 'fgfdgjkii',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.1'
      },
      {
        id: 'llllllllll',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.2'
      },
      {
        id: '0000000000000',
        moduleName: 'ZupIT/darwin-ui',
        componentName: 'component1',
        version: 'v.1.2.3'
      }
    ]
  }
];

export default {
  circleMetricsData,
  circlesMetrics,
  deployMetrics,
  allCirclesMetrics,
  allCircleReleases
};
