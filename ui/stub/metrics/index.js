import mock from './mock';

const API = '/moove/metrics';

const CIRCLES_API = '/moove/v2/circles';

const DEPLOYMENTS_API = '/moove/v2/deployments';

const findCircleMetrics = {
  method: 'GET',
  path: `${API}/circle/{circleId}/components'`,
  handler: (req, h) => h.response(mock.circlesMetrics)
};

const findDeployMetrics = {
  method: 'GET',
  path: `${API}/deployments`,
  handler: (req, h) => h.response(mock.deployMetrics())
};

const findAllCirclesMetrics = {
  method: 'GET',
  path: `${API}/circles`,
  handler: (req, h) => h.response(mock.circlesMetricsDashboard)
};

const findAllCirclesHistory = {
  method: 'GET',
  path: `${CIRCLES_API}/history`,
  handler: async (req, h) => h.response(mock.circlesHistory)
};

const findAllCirclesReleases = {
  method: 'GET',
  path: `${DEPLOYMENTS_API}/circles/{circleId}/history`,
  handler: async (req, h) => h.response(mock.allCircleReleases)
};

const findAllReleases = {
  method: 'POST',
  path: `${DEPLOYMENTS_API}/history`,
  handler: (req, h) => h.response(mock.allDeployReleases)
};

export default {
  findCircleMetrics,
  findDeployMetrics,
  findAllCirclesHistory,
  findAllCirclesReleases,
  findAllCirclesMetrics,
  findAllReleases
};
