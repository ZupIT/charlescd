const mock = require("./mock");

const API = "/moove/v2/roles";

const findAll = {
  method: "GET",
  path: `${API}`,
  handler: (req, h) => h.response(mock.roles)
};

module.exports = {
  findAll
};
