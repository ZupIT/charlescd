import mock from './mock';
import mockUserGroups from '../user-groups/mock';

const API = '/moove/v2/workspaces';

const create = {
  method: 'POST',
  path: `${API}/{id}/groups`,
  handler: (req, h) => h.response(mock.groupRoles)
};

const detach = {
  method: 'DELETE',
  path: `${API}/{id}/groups/{groupId}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case 'bf98232d-6784-419b-a737-cc4391430de9':
        return h.response(mockUserGroups.userGroups.content[0]);
      case 'e0564c7b-757f-4aaa-93c5-337415a67fc7':
        return h.response(mockUserGroups.userGroups.content[1]);
      case 'f0cda81f-a7cb-4036-938d-33cbb959cc4a':
        return h.response(mockUserGroups.userGroups.content[2]);
      case 'fad01026-870f-4616-a245-f8a753a9a4d7':
        return h.response(mockUserGroups.userGroups.content[3]);
      default:
        return h.response(mockUserGroups.userGroup);
    }
  }
};

export default {
  create,
  detach
};
