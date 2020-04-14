const mock = require('./mock')

const API = '/metrics'

const getMetrics = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.requestPerTime),
}

module.exports = {
  getMetrics,
}
