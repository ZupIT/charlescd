const mock = require('./mock')

const AUTH_INFO_API = '/auth/info'
const GROUPS_API = `${AUTH_INFO_API}/groups`
const ROLES_API = `${AUTH_INFO_API}/roles`

const getGroups = {
  method: 'GET',
  path: `${GROUPS_API}`,
  handler: (req, h) => h.response(mock.groups),
}

const getGroup = {
  method: 'GET',
  path: `${GROUPS_API}/{groupId}`,
  handler: (req, h) => h.response(mock.groups[0]),
}

const persistGroup = {
  method: ['PUT', 'POST'],
  path: `${GROUPS_API}/{groupId}`,
  handler: (req, h) => h.response({}),
}

const persitGroups = {
  method: ['POST', 'PUT', 'DELETE'],
  path: `${GROUPS_API}`,
  handler: (req, h) => h.response({}),
}

const getRoles = {
  method: 'GET',
  path: `${ROLES_API}`,
  handler: (req, h) => h.response(mock.roles),
}

module.exports = {
  getGroups,
  getGroup,
  persistGroup,
  getRoles,
  persitGroups,
}
