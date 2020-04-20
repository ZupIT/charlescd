import { BaseApi } from './base'

const API = '/circles'
const defaultPage = 0

const Circles = {
  findAll(page = defaultPage, active = true, name) {
    const params = new URLSearchParams()

    params.append('page', page)
    params.append('active', active)
    params.append('sort', 'created_At,asc')
    name && params.append('name', name)

    return BaseApi.request(`${API}?${params}`)
  },
  findById(circleId) {
    return BaseApi.request(`${API}/${circleId}`)
  },
  createCircle(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  updateCircle(circleId, data) {
    return BaseApi.request(`${API}/${circleId}`, { method: 'PUT', data })
  },
  identifyCircle(identifier) {
    const data = { username: identifier }

    return BaseApi.request(`${API}/identify/darwin`, { method: 'POST', data })
  },
  createCircleWithFile(data, onUploadProgress) {
    return BaseApi.request(`${API}/csv`, { method: 'POST', data, onUploadProgress })
  },
  updateCircleWithFile(circleId, data, onUploadProgress) {
    return BaseApi.request(`${API}/${circleId}/csv`, { method: 'PUT', data, onUploadProgress })
  },
}

export default Circles
