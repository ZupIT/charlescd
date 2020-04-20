const mock = require('./mock')

const API = '/valueflows'

const getValueFlows = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.valueflows),
}

const getValueFlow = {
  method: 'GET',
  path: `${API}/{valueflowId}`,
  handler: (req, h) => h.response(mock.valueflow),
}

module.exports = {
  getValueFlows,
  getValueFlow,
}
