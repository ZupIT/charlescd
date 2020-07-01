import mock from './mock';

const v2API = '/moove/v2/users';

const v1API = '/moove/users';

const findAllUsers = {
  method: 'GET',
  path: `${v2API}`,
  handler: (req, h) => h.response(mock.users)
};

const findUserByEmail = {
  method: 'GET',
  path: `${v2API}/{email}`,
  handler: (req, reply) => {
    const { email } = req.params;
    const decodeEmail = Buffer.from(email, 'base64').toString('binary');

    const usersPayload = {
      'root@zup.com.br': mock.rootUser,
      'user.2@zup.com.br': mock.users.content[1],
      'user.3@zup.com.br': mock.users.content[2],
      'user.4@zup.com.br': mock.users.content[3],
      'user.5@zup.com.br': mock.users.content[4]
    };

    const response = usersPayload[decodeEmail] || mock.rootUser;
    return reply
      .response(response)
      .header('authorization', mock.rootAuthorization)
      .header('x-circle-id', 'f9adc6f7-25ce-4fff-b0b1-d00801930f6b')
      .header('x-workspace-id', 'af15356b-a85d-451b-813a-83953e4b7f56');
  }
};

const createNewUser = {
  method: 'POST',
  path: `${v1API}`,
  handler: (req, h) => h.response(mock.newUser)
};

const deleteUserById = {
  method: 'DELETE',
  path: `${v1API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case 'c7e6dete-aa7a-4216-be1b-34eacd4c2915':
        return h.response(mock.users.content[0]);
      case 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f':
        return h.response(mock.users.content[1]);
      case '13ea193b-f9d2-4wed-b1ce-471a7ae871c2':
        return h.response(mock.users.content[2]);
      case '8b81e7a7-33f1-46cb-aedf-73222bf8769f':
        return h.response(mock.users.content[3]);
      case 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45':
        return h.response(mock.users.content[4]);
      default:
        return h.response(mock.user);
    }
  }
};

const updateProfile = {
  method: 'PUT',
  path: `${v1API}/{id}`,
  handler: (req, h) => h.response(mock.updateProfile)
};

export default {
  findAllUsers,
  findUserByEmail,
  createNewUser,
  deleteUserById,
  updateProfile
};
