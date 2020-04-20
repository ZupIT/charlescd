import { BaseRxApi, BaseApi } from './base'

const API = '/modules'
const defaultPage = 0
const size = 100

const Modules = {
  findById: moduleId => BaseRxApi.request(`${API}/${moduleId}`),
  getModulesRx(page = defaultPage) {
    return BaseRxApi.request(`${API}?page=${page}`, { method: 'GET' })
  },
  getModule(id) {
    return BaseApi.request(`${API}/${id}`)
  },
  getModules(page = defaultPage) {
    return BaseApi.request(`${API}?page=${page}&size=${size}`, { method: 'GET' })
  },
  saveModule(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  updateModule(moduleId, data) {
    return BaseApi.request(`${API}/${moduleId}`, { method: 'PUT', data })
  },
  deleteModule(moduleId) {
    return BaseApi.request(`${API}/${moduleId}`, { method: 'DELETE' })
  },
  getTags(componentId) {
    return BaseApi.request(`${API}/components/${componentId}/tags`, { method: 'GET' })
  },
}

export default Modules
