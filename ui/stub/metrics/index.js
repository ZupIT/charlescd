const mock = require("./mock");

const API = "/moove/metrics/circle/{circleId}/components";

const findCircleMetrics = {
  method: "GET",
  path: `${API}`,
  handler: (req, h) => h.response(mock.CirclesMetrics)
};

module.exports = {
  findCircleMetrics
};
