import mock from './mock';

const API = '/moove/v2/configurations/metric-configurations';

const create = {
  method: 'POST',
  path: `${API}`,
  handler: (req, h) => h.response(mock.newMetricProvider)
};

export default {
  create
};
