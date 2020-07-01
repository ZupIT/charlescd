import mock from './mock';

const API = '/moove/v2/workspaces';

const findAll = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.workspaces)
};

const findById = {
  method: 'GET',
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case 'efbf25e0-c4dc-46c5-9fe4-61eb24049ac7':
        return h.response(mock.workspaces.content[0]);
      case 'b53e07a4-8b0d-449d-985a-970a9a0e0576':
        return h.response(mock.workspaces.content[1]);
      case '034d2225-d7b2-499e-96e2-53cac99ff405':
        return h.response(mock.workspaces.content[2]);
      case 'd90fd814-5e33-43c6-ba2d-d9d04c5a5ec6':
        return h.response(mock.workspaces.content[3]);
      case '2369847c-94f7-43c9-87c2-4f00c73290e7':
        return h.response(mock.workspaces.content[4]);
      default:
        return h.response(mock.workspace);
    }
  }
};

const saveWorkspaceName = {
  method: 'POST',
  path: `${API}`,
  handler: (req, h) => h.response(mock.newWorkspace)
};

const updateName = {
  method: 'PATCH',
  path: `${API}/{id}`,
  handler: (req, h) => h.response(mock.updateWorkspaceName)
};

export default {
  findAll,
  findById,
  saveWorkspaceName,
  updateName
};
