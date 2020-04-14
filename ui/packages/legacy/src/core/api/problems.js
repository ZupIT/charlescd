import { BaseApi } from './base'

const API = '/problems'

const Problems = {
  findAll() {
    return BaseApi.request(`${API}`, { method: 'GET' })
  },

  findById(problemId) {
    return BaseApi.request(`${API}/${problemId}`, { method: 'GET' })
  },

  update(problemId, data) {
    return BaseApi.request(`${API}/${problemId}`, { method: 'PUT', data })
  },

  create(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
}

export default Problems
