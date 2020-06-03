const mock = require("./mock");

const API = "/moove/v2/modules";

const findAll = {
  method: "GET",
  path: `${API}`,
  handler: (req, h) => h.response(mock.modules)
};

const findById = {
  method: "GET",
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case "4d1cf7a9-d2f5-43b0-852e-e1b583b71c58":
        return h.response(mock.modules.content[0]);
      case "41e218b5-1005-4f7c-9e02-f542we9e03f1":
        return h.response(mock.modules.content[1]);
      case "be6ga24r2-9008-4d13-8966-09715ebba8f":
        return h.response(mock.modules.content[2]);
      default:
        return h.response(mock.defaultModule);
    }
  }
};

const create = {
  method: "POST",
  path: `${API}`,
  handler: (req, h) => h.response(mock.newModule)
};

const update = {
  method: "PUT",
  path: `${API}/{id}`,
  handler: (req, h) => h.response(mock.updateodule)
};

const deleteModule = {
  method: "DELETE",
  path: `${API}/{id}`,
  handler: (req, h) => {
    const { id } = req.params;

    switch (id) {
      case "4d1cf7a9-d2f5-43b0-852e-e1b583b71c58":
        return h.response(mock.modules.content[0]);
      case "41e218b5-1005-4f7c-9e02-f542we9e03f1":
        return h.response(mock.modules.content[1]);
      case "be6ga24r2-9008-4d13-8966-09715ebba8f":
        return h.response(mock.modules.content[2]);
      default:
        return h.response(mock.defaultModule);
    }
  }
};

const createComponent = {
  method: "POST",
  path: `${API}/{moduleId}/components`,
  handler: (req, h) => h.response(mock.newComponent)
};

const updateComponent = {
  method: "PUT",
  path: `${API}/{moduleId}/components/{componentId}`,
  handler: (req, h) => h.response(mock.updateComponent)
};

const deleteCompoent = {
  method: "DELETE",
  path: `${API}/{moduleId}/components/{componentId}`,
  handler: (req, h) => console.log(req.params)
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteModule,
  createComponent,
  updateComponent,
  deleteCompoent
};
