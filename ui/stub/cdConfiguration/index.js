const mock = require("./mock");

const API = "/moove/config/cd";

const create = {
  method: "POST",
  path: `${API}`,
  handler: (req, h) => h.response(mock.newCDConfiuration)
};

module.exports = {
  create
};
