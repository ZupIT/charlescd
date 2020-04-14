import { BaseApi } from './base'

const API = '/applications'

const Application = {
  findAll() {
    return BaseApi.request(`${API}`, { method: 'GET' })
  },
  findById(applicationId) {
    return BaseApi.request(`${API}/${applicationId}`, { method: 'GET' })
  },
  create(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  update(applicationId, data) {
    return BaseApi.request(`${API}/${applicationId}`, { method: 'PUT', data })
  },
  addMember(applicationId, data) {
    return BaseApi.request(`${API}/${applicationId}/members`, { method: 'POST', data })
  },
}

export default Application
