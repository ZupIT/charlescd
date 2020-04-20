const mock = require('./mock')

const API = '/modules'

const getModules = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.modules),
}

module.exports = {
  getModules,
}
