const mock = require('./mock')

const API = '/hypotheses'

const findById = {
  method: 'GET',
  path: `${API}/columnsById/1`,
  handler: (req, h) => h.response(mock.board),
}

const status = {
  method: 'GET',
  path: `${API}/{hypothesisId}/events/status`,
  handler: (req, h) => h.response(mock.status),
}

const boardById = {
  method: 'GET',
  path: `${API}/{hypothesisId}/board`,
  handler: (req, h) => h.response(mock.board),
}

const hypothesis = {
  method: 'GET',
  path: `${API}/{hypothesisId}`,
  handler: (req, h) => h.response(mock.hypothesis),
}

const deployments = {
  method: 'GET',
  path: `${API}/{hypothesisId}/deployments`,
  handler: (req, h) => h.response(mock.deployments),
}

const validated = {
  method: 'GET',
  path: `${API}/{hypothesisId}/builds/validated`,
  handler: (req, h) => h.response(mock.validated),
}

module.exports = {
  findById,
  status,
  boardById,
  hypothesis,
  deployments,
  validated,
}
