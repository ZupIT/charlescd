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

const findAllCirclsMetrics = {
  method: 'GET',
  path: `${API}/circles`,
  handler: async (req, h) => {
    const query = req;

    const fetchData = await fetch(
      `https://picsum.photos/v2/list?page=${query.page}&limit=10`
    );
    const responseAsJson = await fetchData.json();
    const { history, ...rest } = mock.allCirclesMetrics;
    return h.response({ history: responseAsJson, ...rest });
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
  findAllCirclsReleases
};
