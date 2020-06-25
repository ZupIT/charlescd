import mock from './mock';

const API = '/moove/v2/circles';

const findAllCircles = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.circles)
};

const findCircleById = {
  method: 'GET',
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case 'f52eda57-5607-4306-te33-477eg398cc2a':
        return h.response(mock.circles.content[0]);
      case '883t35d8-dece-412f-9w25-f37h54e56fa5':
        return h.response(mock.circles.content[1]);
      case 'cay5h4a5-6278-45b5-ab15-a53e76tdbc3e':
        return h.response(mock.circles.content[2]);
      default:
        return h.response(mock.circle);
    }
  }
};

const deleteCircleById = {
  method: 'DELETE',
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case 'f52eda57-5607-4306-te33-477eg398cc2a':
        return h.response(mock.circles.content[0]);
      case '883t35d8-dece-412f-9w25-f37h54e56fa5':
        return h.response(mock.circles.content[1]);
      case 'cay5h4a5-6278-45b5-ab15-a53e76tdbc3e':
        return h.response(mock.circles.content[2]);
      default:
        return h.response(mock.circle);
    }
  }
};

export default {
  findAllCircles,
  findCircleById,
  deleteCircleById
};
