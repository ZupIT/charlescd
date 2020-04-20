const mock = require('./mock')

const API = '/users'

const getUsers = {
  method: 'GET',
  path: `${API}`,
  handler: (req, h) => h.response(mock.users),
}

const getUserByEmail = {
  method: 'GET',
  path: `${API}/{email}`,
  handler: (req, h) => h.response(mock.user),
}

module.exports = {
  getUsers,
  getUserByEmail,
}
