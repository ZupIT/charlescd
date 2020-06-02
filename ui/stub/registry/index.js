const mock = require("./mock");

const API = "/moove/config/registry";

const create = {
  method: "POST",
  path: `${API}`,
  handler: (req, h) => h.response(mock.newRegistry)
};

module.exports = {
  create
};
