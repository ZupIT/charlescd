import mock from './mock';

const API = '/moove/config/registry';

const create = {
  method: 'POST',
  path: `${API}`,
  handler: (req, h) => h.response(mock.newRegistry)
};

export default {
  create
};
