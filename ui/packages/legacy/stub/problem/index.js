const mock = require('./mock')

const API = '/problems'

const problem = {
  method: 'GET',
  path: `${API}/{problemId}`,
  handler: (req, h) => h.response(mock.problem),
}


module.exports = {
  problem,
}
