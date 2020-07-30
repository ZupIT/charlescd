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
      averageTime: random(0, 203),
      period: '08-12-2020'
    },
    {
      averageTime: random(0, 102),
      period: '08-13-2020'
    },
    {
      averageTime: random(0, 330),
      period: '08-14-2020'
    },
    {
      averageTime: random(0, 83),
      period: '08-15-2020'
    },
    {
      averageTime: random(0, 26),
      period: '08-16-2020'
    },
    {
      averageTime: random(0, 150),
      period: '08-17-2020'
    },
    {
      averageTime: random(0, 203),
      period: '08-18-2020'
    }
  ]
});

const circlesHistory = {
  summary: {
    active: 10,
    inactive: 10
  },
  page: {
    content: [
      {
        id: 'abc-123',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1234',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1235',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-126',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1237',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-123',
        status: 'INACTIVE',
        name: 'Circle B',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1237',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-123',
        status: 'INACTIVE',
        name: 'Circle B',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1237',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-123',
        status: 'INACTIVE',
        name: 'Circle B',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1237',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-123',
        status: 'INACTIVE',
        name: 'Circle B',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1237',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-123',
        status: 'INACTIVE',
        name: 'Circle B',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      }
    ],
    page: 0,
    size: 1,
    isLast: false,
    totalPages: 1
  }
};

const allCircleReleases = {
  content: [
    {
      id: 'dnsafjhf',
      tag: 'release-darwin-new-repos',
      deployedAt: null,
      undeployedAt: null,
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'jfdhfuhfds',
      tag: 'release-darwin-new-test',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'dnsafjhffdsfjdsbh',
      tag: 'release-darwin-new-gmfgoij',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'dnsafjhf',
      tag: 'release-darwin-new-repos',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'jfdhfuhfds',
      tag: 'release-darwin-new-test',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'dnsafjhffdsfjdsbh',
      tag: 'release-darwin-new-gmfgoij',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'dnsafjhf',
      tag: 'release-darwin-new-repos',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'jfdhfuhfds',
      tag: 'release-darwin-new-test',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    },
    {
      id: 'dnsafjhffdsfjdsbh',
      tag: 'release-darwin-new-gmfgoij',
      deployedAt: '2020-07-12 10:25:38',
      undeployedAt: '2020-07-12 10:25:38',
      authorName: 'Leandro Latini',
      components: [
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.1'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.2'
        },
        {
          moduleName: 'ZupIT/darwin-ui',
          name: 'component1',
          version: 'v.1.2.3'
        }
      ]
    }
  ],
  page: 0,
  size: 1,
  isLast: false,
  totalPages: 1
};

const circlesMetricsDashboard = {
  circleStats: {
    active: 12,
    inactive: 8
  },
  averageLifeTime: 464047
};

export default {
  circleMetricsData,
  circlesMetrics,
  deployMetrics,
  circlesHistory,
  allCircleReleases,
  circlesMetricsDashboard
};
