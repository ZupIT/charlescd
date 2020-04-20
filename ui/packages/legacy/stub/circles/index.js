const mock = require('./mock')

const API = '/circles'

const getCircleID = {
  method: 'POST',
  path: `${API}/identify/darwin`,
  handler: (req, h) => h.response(mock.circleID),
}

const getCircles = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.circles),
}

module.exports = {
  getCircleID,
  getCircles,
}
