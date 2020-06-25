import mock from './mock';

const API = '/charlescd-circle-matcher';

const identify = {
  method: 'POST',
  path: `${API}/identify`,
  handler: (req, reply) => reply.response(mock.identify)
};

export default {
  identify
};
