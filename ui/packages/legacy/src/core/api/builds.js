import { BaseApi } from './base'

const API = 'v2/builds'

const Builds = {
  findByName(params) {
    return BaseApi.request(`${API}`, { method: 'GET', params })
  },
  findById(buildId) {
    return BaseApi.request(`${API}/${buildId}`, { method: 'GET' })
  },
  create(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  buildCompose(data) {
    return BaseApi.request(`${API}/compose`, { method: 'POST', data })
  },
  archive(buildId) {
    return BaseApi.request(`${API}/${buildId}/archive`, { method: 'PATCH' })
  },
  delete(buildId) {
    return BaseApi.request(`${API}/${buildId}`, { method: 'DELETE' })
  },
  updateBuildColumn(buildId, columnId) {
    return BaseApi.request(`${API}/${buildId}/column/${columnId}`, { method: 'PATCH' })
  },
}

export default Builds
