import { BaseApi } from './base'

const API = '/users'
const defaultPage = 0
const defaultSize = 25

const Users = {
  findAll(page = defaultPage, size = defaultSize) {
    return BaseApi.request(`${API}?page=${page}&size=${size}&sort=createdAt,desc`, { method: 'GET' })
  },
  find(id) {
    return BaseApi.request(`${API}/${id}`, { method: 'GET' })
  },
  create(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  update(id, data) {
    return BaseApi.request(`${API}/${id}`, { method: 'PUT', data })
  },
  addUserToGroup(id, data) {
    return BaseApi.request(`${API}/${id}/groups`, { method: 'POST', data })
  },
  getUserByEmail(email) {
    const encodeEmail = btoa(email)

    return BaseApi.request(`${API}/${encodeEmail}`)
  },
  getUserGroups(id) {
    return BaseApi.request(`${API}/${id}/groups`)
  },
  removeUserFromGroup(userId, groupId) {
    return BaseApi.request(`${API}/${userId}/groups/${groupId}`, { method: 'DELETE' })
  },
}

export default Users
