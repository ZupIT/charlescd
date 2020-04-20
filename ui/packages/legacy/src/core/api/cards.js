import { BaseApi } from './base'

const API = '/cards'

const Cards = {
  create(data) {
    return BaseApi.request(`${API}`, { method: 'POST', data })
  },
  update(cardId, data) {
    return BaseApi.request(`${API}/${cardId}`, { method: 'PUT', data })
  },
  archive(cardId) {
    return BaseApi.request(`${API}/${cardId}/archive`, { method: 'PATCH' })
  },
  delete(cardId) {
    return BaseApi.request(`${API}/${cardId}`, { method: 'DELETE' })
  },
  updateMembers(cardId, data) {
    return BaseApi.request(`${API}/${cardId}/members`, { method: 'POST', data })
  },
  getById(id) {
    return BaseApi.request(`${API}/${id}`)
  },
  addComment(cardId, data) {
    return BaseApi.request(`${API}/${cardId}/comments`, { method: 'POST', data })
  },
}

export default Cards
