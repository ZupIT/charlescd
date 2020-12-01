import { DEPLOYMENT_STATUS } from "core/enums/DeploymentStatus";
import { Author, Circle, Deployment } from "modules/Circles/interfaces/Circle";
import { CirclePercentagePagination } from "modules/Circles/interfaces/CirclesPagination";

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

export const circlePercentage: Circle = {
    author: author,
    createdAt: "fake-data",
    deployment: deployment,
    id: "fake-id",
    name: "fake-circle",
    rules: null,
    percentage: 10,
    matcherType: "PERCENTAGE"
  };

export const circleManually: Circle = {
  author: author,
  createdAt: "fake-data",
  deployment: deployment,
  id: "fake-id",
  name: "fake-circle",
  rules: null,
  percentage: 10,
  matcherType: "REGULAR"
};

export const circleCSV: Circle = {
  author: author,
  createdAt: "fake-data",
  deployment: deployment,
  id: "fake-id",
  name: "fake-circle",
  rules: null,
  percentage: 10,
  matcherType: "SIMPLE_KV"
};

export const mockPercentageCircles: CirclePercentagePagination = {
  content: [
    {
      circles: [circle],
      sumPercentage: 10
    }
  ],
  page: 0,
  size: 100,
  totalPages: 2,
  last: false
};

export const mockFullPercentageCircles: CirclePercentagePagination = {
  content: [
    {
      circles: [circle],
      sumPercentage: 100
    }
  ],
  page: 0,
  size: 100,
  totalPages: 2,
  last: false
};

export const mockEmptyPercentageCircles: CirclePercentagePagination = {
  content: [
    {
      circles: [],
      sumPercentage: 0
    }
  ],
  page: 0,
  size: 100,
  totalPages: 2,
  last: false
};
