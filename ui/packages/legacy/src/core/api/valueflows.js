import { BaseApi } from './base'

const API = '/valueflows'
const defaultPage = 0

const ValueFlows = {
  findAll(page = defaultPage) {
    const params = { sort: 'createdAt,desc' }

    return BaseApi.request(`${API}?page=${page}`, { method: 'GET', params })
  },

  findById(valueFlowId) {
    return BaseApi.request(`${API}/${valueFlowId}`, { method: 'GET' })
  },

  create(payload) {
    return BaseApi.request(`${API}`, { method: 'POST', data: payload })
  },
}

export default ValueFlows
