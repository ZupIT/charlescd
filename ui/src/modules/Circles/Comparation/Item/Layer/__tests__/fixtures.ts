import { DEPLOYMENT_STATUS } from "core/enums/DeploymentStatus";
import { Author, Circle, Deployment } from "modules/Circles/interfaces/Circle";


export const MetricsGroupsResume = [
  {
    id: '1',
    createdAt: '2020-09-05T12:20:40.406925Z',
    name: 'Metrics group 1',
    metricsCount: 1,
    thresholds: 10,
    thresholdsReached: 0,
    status: 'ACTIVE',
  },
  {
    id: '2',
    createdAt: '2020-09-04T12:20:40.406925Z',
    name: 'Metrics group 2',
    metricsCount: 2,
    thresholds: 3,
    thresholdsReached: 3,
    status: 'ACTIVE',
  },{
    id: '3',
    createdAt: '2020-09-03T12:20:40.406925Z',
    name: 'Metrics group 3',
    metricsCount: 3,
    thresholds: 4,
    thresholdsReached: 2,
    status: 'ERROR',
  },{
    id: '4',
    createdAt: '2020-09-02T12:20:40.406925Z',
    name: 'Metrics group 4',
    metricsCount: 4,
    thresholds: 5,
    thresholdsReached: 4,
    status: 'REACHED',
  },
  {
    id: '5',
    createdAt: '2020-09-01T12:20:40.406925Z',
    name: 'Metrics group 5',
    metricsCount: 5,
    thresholds: 0,
    thresholdsReached: 0,
    status: 'ACTIVE',
  },
  {
    id: '6',
    createdAt: '2020-08-30T12:20:40.406925Z',
    name: 'Metrics group 6',
    metricsCount: 6,
    thresholds: 1,
    thresholdsReached: 0,
    status: 'ACTIVE',
  }
];

export const author: Author = {
  id: "fake-id",
  name: "fake-name",
  email: "fake-email",
  createdAt: "fake-data"
};

export const deployment: Deployment = {
  artifacts: null,
  deployedAt: "fake-timer",
  id: "fake-deployment-id",
  status: DEPLOYMENT_STATUS.deployed,
  tag: "fake-tag"
};

export const circle: Circle = {
  author: author,
  createdAt: "fake-data",
  deployment: deployment,
  id: "fake-id",
  name: "fake-circle",
  rules: null,
  percentage: 10,
  matcherType: "PERCENTAGE"
};

export const regularCircle: Circle = {
  author: author,
  createdAt: "fake-data",
  deployment: deployment,
  id: "fake-id",
  name: "fake-circle",
  rules: {
    type: 'CLAUSE',
    clauses: [
      {
        type: 'RULE',
        content: { key: 'username', value: ['empty'], condition: 'EQUAL' }
      }
    ],
    logicalOperator: 'OR'
  },
  percentage: 10,
  matcherType: "REGULAR"
};

export const circleWithoutDeployment: Circle = {
  author: author,
  createdAt: "fake-data",
  deployment: null,
  id: "fake-id",
  name: "fake-circle",
  rules: null,
  percentage: 10,
  matcherType: "PERCENTAGE"
}

export const circleData: Circle = {
  id: '427',
  name: 'yyz',
  author: {
    id: '1980',
    name: 'Rush',
    email: 'rush@zup',
    createdAt: 'old'
  },
  createdAt: '1981',
  deployment: undefined,
  rules: undefined
};

export const newCircleData: Circle = {
  id: undefined,
  name: undefined,
  author: undefined,
  createdAt: undefined,
  deployment: undefined,
  rules: undefined
};
