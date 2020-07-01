import mock from './mock';

const API = '/moove/v2/configurations/git';

const create = {
  method: 'POST',
  path: `${API}`,
  handler: (req, h) => h.response(mock.newGit)
};

export default {
  create
};
