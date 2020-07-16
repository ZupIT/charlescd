import mock from './mock';
import fetch from 'node-fetch';

const API = '/moove/metrics';

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

const findAllCirclsMetrics = {
  method: 'GET',
  path: `${API}/circles/history`,
  handler: async (req, h) => {
    const query = req;

    return h.response(mock.circlesHistory);
  }
};

const findAllCirclsReleases = {
  method: 'GET',
  path: `${API}/circles/{circleId}/releases`,
  handler: (req, h) => h.response(mock.allCircleReleases)
};

export default {
  findCircleMetrics,
  findDeployMetrics,
  findAllCirclsMetrics,
  findAllCirclsReleases,
  findAllCirclesMetrics
};
