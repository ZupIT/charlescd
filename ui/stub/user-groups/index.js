const mock = require("./mock");

const API = "/moove/v2/user-groups";

const findAllUserGroup = {
  method: "GET",
  path: `${API}`,
  handler: (req, h) => h.response(mock.userGroups)
};

const findUserGroupById = {
  method: "GET",
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case "bf98232d-6784-419b-a737-cc4391430de9":
        return h.response(mock.userGroups.content[0]);
      case "e0564c7b-757f-4aaa-93c5-337415a67fc7":
        return h.response(mock.userGroups.content[1]);
      case "f0cda81f-a7cb-4036-938d-33cbb959cc4a":
        return h.response(mock.userGroups.content[2]);
      case "fad01026-870f-4616-a245-f8a753a9a4d7":
        return h.response(mock.userGroups.content[3]);
      default:
        return h.response(mock.userGroup);
    }
  }
};

const saveUserGroup = {
  method: "POST",
  path: `${API}`,
  handler: (req, h) => h.response(mock.createUserGroup)
};

const updateUserGroup = {
  method: "PUT",
  path: `${API}/{id}`,
  handler: (req, h) => h.response(mock.updateUserGroup)
};

const deleteUserGroup = {
  method: "DELETE",
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case "bf98232d-6784-419b-a737-cc4391430de9":
        return h.response(mock.userGroups.content[0]);
      case "e0564c7b-757f-4aaa-93c5-337415a67fc7":
        return h.response(mock.userGroups.content[1]);
      case "f0cda81f-a7cb-4036-938d-33cbb959cc4a":
        return h.response(mock.userGroups.content[2]);
      case "fad01026-870f-4616-a245-f8a753a9a4d7":
        return h.response(mock.userGroups.content[3]);
      default:
        return h.response(mock.userGroup);
    }
  }
};

module.exports = {
  findAllUserGroup,
  findUserGroupById,
  saveUserGroup,
  updateUserGroup,
  deleteUserGroup
};
