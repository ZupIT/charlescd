import mock from './mock';

const API = '/moove/metrics';

const findCircleMetrics = {
  method: 'GET',
  path: `${API}/circle/{circleId}/components'`,
  handler: (req, h) => h.response(mock.CirclesMetrics)
};

const findDeployMetrics = {
  method: 'GET',
  path: `${API}/deployments`,
  handler: (req, h) => h.response(mock.DeployMetrics)
};

export default {
  findCircleMetrics,
  findDeployMetrics
};
