import { BaseApi } from './base'

const API = '/hypotheses'

const Hypotheses = {
  findById(id) {
    return BaseApi.request(`${API}/${id}/board`)
  },
  createHypothesis(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  getHypothesisById(hypothesisId) {
    return BaseApi.request(`${API}/${hypothesisId}`)
  },
  getDeploymentsById(hypothesisId) {
    return BaseApi.request(`${API}/${hypothesisId}/deployments`)
  },
  getValidatedBuilds(hypothesisId) {
    return BaseApi.request(`${API}/${hypothesisId}/builds/validated`)
  },
  update(hypothesisId, data) {
    return BaseApi.request(`${API}/${hypothesisId}`, { method: 'PUT', data })
  },
  updateCardColumn(hypothesisId, cardId, data) {
    return BaseApi.request(`${API}/${hypothesisId}/cards/${cardId}/column`, { method: 'PATCH', data })
  },
  orderCardsInColumn(hypothesisId, data) {
    return BaseApi.request(`${API}/${hypothesisId}/cards`, { method: 'PATCH', data })
  },
  addCircles(hypothesisId, data) {
    return BaseApi.request(`${API}/${hypothesisId}/circles`, { method: 'POST', data: [data] })
  },
  buildEvents(hypothesisId) {
    return BaseApi.request(`${API}/${hypothesisId}/events/status`)
  },
}

export default Hypotheses
