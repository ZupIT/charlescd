import { BaseApi } from './base'

const AUTH_INFO_API = '/auth/info'
const GROUPS_API = `${AUTH_INFO_API}/groups`
const ROLES_API = `${AUTH_INFO_API}/roles`

const AuthInfo = {
  createGroup(data) {
    return BaseApi.request(GROUPS_API, { method: 'POST', data })
  },
  editGroup(id, data) {
    return BaseApi.request(`${GROUPS_API}/${id}`, { method: 'PUT', data })
  },
  deleteGroup(id) {
    return BaseApi.request(`${GROUPS_API}/${id}`, { method: 'DELETE' })
  },
  getGroups() {
    return BaseApi.request(GROUPS_API)
  },
  getGroup(id) {
    return BaseApi.request(`${GROUPS_API}/${id}`)
  },
  getRoles() {
    return BaseApi.request(ROLES_API)
  },
}

export default AuthInfo
